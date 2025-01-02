import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Modal } from "rsuite";
import DrinkModal from "./DrinkModal";

const UpdateDrinkModal= (
  { 
    setDrinkUpdateModal
  }) => {
    const [drinkDetails , setDrinkDetails] = useState();
    const [drinkData,setDrinkdata]=useState();
    const [drinkName,setDrinkName]=useState();
    const [drinkId,setDrinkId]= useState();
    const [showdrinkUpdateModal,setshowUpdateDrinkModal]=useState();
    // const [drinkUpdateModal,setDrinkUpdateModal]=useState();
    const dispatch = useDispatch();

  const handleDeleteDrink = async ( drinkType,id) => {
    console.log("inside delete");
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const getData = (await getDoc(docRef)).data();
      console.log("before update", getData);
      const drinkdata = getData[drinkType].filter((drinkId) => drinkId.id != id);
      await updateDoc(docRef, { [drinkType]: drinkdata });
          const updatedDoc= (await getDoc(docRef)).data();
      setDrinkdata(updatedDoc);
      console.log("after update", getData);
      console.log("meal deleted");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
      
    }
  };

   const handleEdit = (drinkType ,id)=>{
         setDrinkName(drinkType);
         setDrinkId(id);
         setShowDrinkModal(true);

   }

  const handleEditModalData = async () => {
    console.log("insdie edit");
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const data = {
        id: selectedId,
        name: selectedFoodData?.foods[0]?.food_name,
        calories: Math.round(calculateCalories),
        proteins: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      };
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const getData = (await getDoc(docRef)).data();
      console.log("before update", getData);
      const mealdata = getData[editMealName].filter(
        (meal) => meal.id != selectedId
      );
      console.log("mealData", mealdata);
      await updateDoc(docRef, { [editMealName]: mealdata });

      const newData = { [selectCategory]: arrayUnion(data) };
      await updateDoc(docRef, newData);
      const updatedDoc = (await getDoc(docRef)).data();
      setLogdata(updatedDoc);
      console.log("updated doc", updatedDoc);
    } catch (error) {
      console.log(error);
    } finally {
      setEditModal(false);
      dispatch(hideLoader());
    }
  };

   // drinkdata modal
   const getDrinkData = async (user) => {
    console.log("inside drinkData");
    try {
      dispatch(showLoader());
      if (!user) {
        console.log("User is not authenticated");
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
        console.log("No user authenticated");
      }
    });
    return () => unsubscribe();
  }, [drinkData]);


  console.log(drinkDetails);
  return (
    <>
      <button className="close-button" onClick={() => setDrinkUpdateModal(false)}>
        X
      </button>



      <h2 className="modal-title" style={{ color: "black" }}>
       Update Drink Details
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
            {drinkDetails?.Water?.length > 0 ? (
              drinkDetails?.Water?.map((item, index) => (
                <tr key={`water-${index}`}>
                <td> {item.drinklabel}</td>
                  <td>{item.totalAmount}</td>
                 
                  {(
                    <td>
                      <div style={{ display: "flex" }}>
                        <span
                          onClick={() => handleDeleteDrink("Water",   item.id)}
                          className="icon-button delete"
                        >
                          <FaTrashAlt style={{ color: "#e15f41" }} />
                        </span>
                        <span
                          onClick={() =>
                            handleEdit("Water", item.id)
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

      <Modal isOpen={showdrinkUpdateModal}>
          <DrinkModal
            setShowDrinkModal={setshowUpdateDrinkModal}
            // onDataUpdated={handleDataUpdated}
            editDataModal ={handleEditModalData}
          />
        </Modal>
    </>
  );
};

export default UpdateDrinkModal;
