import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Modal } from "rsuite";
import DrinkModal from "./DrinkModal";
import EditDrinkModal from "./EditDrinkModal";

const UpdateDrinkModal= (
  { 
    setDrinkUpdateModal,
    updateDrinkName,
    onDataUpdated,
    setEditDrinkModal,
    editDrinkModal,
    setDrinkId ,
    setDrinkName,
  }) => {
    const [drinkDetails , setDrinkDetails] = useState();
    const [drinkData,setDrinkdata]=useState();
    const [drinkId,setUpdateId]= useState();
    // const [drinkName,setDrinkName] =useState();
    const [editToggle,setEditToggle] =useState(false);
    const dispatch = useDispatch();
 
  

  const handleDeleteDrink = async ( drinkType,id) => {
    
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const getData = (await getDoc(docRef)).data();
      const drinkdata = getData[drinkType].filter((drink) => drink.id != id);
      await updateDoc(docRef, { [drinkType]: drinkdata });
          const updatedDoc= (await getDoc(docRef)).data();
      setDrinkdata(updatedDoc);
      if (onDataUpdated) {
        onDataUpdated(); 
      }
  
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
      
    }
  };


  // open modal  can be optimised using the one function
   const handleEditModal = (drink ,id)=>{
         setDrinkName(drink);
         setDrinkId(id);
         setEditDrinkModal(true);
         setUpdateId(id);
         setDrinkUpdateModal(false);
        //  setEditToggle(true);
      
   }

 


   // drinkdata modal
   const getDrinkData = async (user) => {
  
    try {
      dispatch(showLoader());
      if (!user) {
        return;
      }
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const getData = docSnap.data();
        setDrinkDetails(getData);
      } else {
        setDrinkDetails({});
      }
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getDrinkData(user);
      if (user) {
      } else {
      }
    });
    return () => unsubscribe();
  }, [drinkData]);


  return (
    <>
      <button className="close-button" onClick={() => setDrinkUpdateModal(false)}>
        X
      </button>




      <h2 className="modal-title" style={{ color: "black" }}>
       Update {updateDrinkName} Details
      </h2>
       
      <div> 
        <table className="meal-table">
          <thead>
            <tr>
              
             <th>Drink Size</th>
              <th>Drink quantity(ml)</th>
              { <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {drinkDetails?.[updateDrinkName]?.length > 0 ? (
              drinkDetails?.[updateDrinkName]?.map((item, index) => (
                <tr key={`water-${index}`}>
                <td> {item.drinklabel}</td>
                  <td>{item.totalAmount}</td>
                 
                  {(
                    <td>
                      <div style={{ display: "flex" }}>
                        <span
                          onClick={() => handleDeleteDrink(updateDrinkName, item.id)}
                          className="icon-button delete"
                        >
                          <FaTrashAlt style={{ color: "#e15f41" }} />
                        </span>
                        <span
                          onClick={() =>
                            handleEditModal(updateDrinkName, item.id)
                          }
                          className="icon-button edit"
                        >
                          <FaEdit />
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No breakfast items</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <Modal isOpen={editDrinkModal}>
          <EditDrinkModal
           setEditDrinkModal={setEditDrinkModal}
            // onDataUpdated={handleDataUpdated}
            editDataModal ={handleEditDrinkData}
            drinkType ={drinkType}
            setDrinkType={setDrinkType}
            container ={container}
            setContainer = {setContainer}
            quantity={quantity}
            setQuantity={setQuantity}
            editToggle={editToggle}
          />
        </Modal> */}
    </>
  );
};

export default UpdateDrinkModal;
