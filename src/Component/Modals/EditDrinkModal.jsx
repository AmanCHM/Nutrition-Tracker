import React from "react";
import { auth, db } from "../../firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import GlobalSelect from "../Page-Components/Globalselect";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditDrinkModal = ({ setEditDrinkModal, drinkName, drinkId, onDataUpdated }) => {
  const dispatch = useDispatch();

  const drinkTypeOptions = [
    { value: "Water", label: "Water" },
    { value: "Alcohol", label: "Alcohol" },
    { value: "Caffeine", label: "Caffeine" },
  ];

  const containerOptions = [
    { value: "Small Glass (100ml)", label: "Small Glass (100ml)" },
    { value: "Medium Glass (175ml)", label: "Medium Glass (175ml)" },
    { value: "Large Glass (250ml)", label: "Large Glass (250ml)" },
  ];

  const formik = useFormik({
    initialValues: {
      drinkType: "",
      container: "",
      quantity: 1,
    },
    validationSchema: Yup.object({
      drinkType: Yup.string().required("Please select a drink type."),
      container: Yup.string().required("Please select a container type."),
      quantity: Yup.number()
        .required("Please enter a quantity.")
        .positive("Quantity must be a positive number.")
        .integer("Quantity must be a whole number."),
    }),
    onSubmit: async (values) => {
      const servingSize =
        values.container === "Small Glass (100ml)"
          ? 100
          : values.container === "Medium Glass (175ml)"
          ? 175
          : 250;

      const totalAmount = servingSize * values.quantity;

      dispatch(showLoader());
      try {
        const user = auth.currentUser;
        const userId = user.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(db, "users", userId, "dailyLogs", date);

        const existingData = (await getDoc(docRef)).data();
        const updatedDrinkData = existingData[drinkName].filter(
          (item) => item.id !== drinkId
        );

        // Remove old drink data
        await updateDoc(docRef, { [drinkName]: updatedDrinkData });

        // Add updated drink data
        const newDrinkData = {
          id: Date.now(),
          totalAmount,
          drinklabel: values.container,
        };
        const newData = { [values.drinkType]: arrayUnion(newDrinkData) };
        await updateDoc(docRef, newData);

        if (onDataUpdated) onDataUpdated();

        toast.success("Drink details updated successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update drink details.");
      } finally {
        setEditDrinkModal(false);
        dispatch(hideLoader());
      }
    },
  });

  return (
    <>
      <button className="close-button" onClick={() => setEditDrinkModal(false)}>
        X
      </button>
      <h2 className="modal-title" style={{ color: "black" }}>
        Update Drink Details
      </h2>

      <form onSubmit={formik.handleSubmit}>
    
        <div className="input-group">
          <label htmlFor="drinkType">Drink Type:</label>
          <GlobalSelect
            options={drinkTypeOptions}
            value={drinkTypeOptions.find((opt) => opt.value === formik.values.drinkType)}
            onChange={(selected) => formik.setFieldValue("drinkType", selected?.value || "")}
            onBlur={() => formik.setFieldTouched("drinkType", true)}
            placeholder="Select a drink type"
          />
          {formik.touched.drinkType && formik.errors.drinkType && (
            <p className="error-message">{formik.errors.drinkType}</p>
          )}
        </div>

        
        <div className="input-group">
          <label htmlFor="container">Container Type:</label>
          <GlobalSelect
            options={containerOptions}
            value={containerOptions.find((opt) => opt.value === formik.values.container)}
            onChange={(selected) => formik.setFieldValue("container", selected?.value || "")}
            onBlur={() => formik.setFieldTouched("container", true)}
            placeholder="Select a container type"
          />
          {formik.touched.container && formik.errors.container && (
            <p className="error-message">{formik.errors.container}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter quantity"
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <p className="error-message">{formik.errors.quantity}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </>
  );
};

export default EditDrinkModal;
