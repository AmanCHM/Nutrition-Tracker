import React from "react";
import "./DrinkModal.css";
import { useDispatch } from "react-redux";
import GlobalSelect from "../Page-Components/Globalselect";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import { auth, db } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const DrinkModal = ({ setShowDrinkModal, onDataUpdated, editDataModal, editToggle }) => {
  const dispatch = useDispatch();

  // Options for the drink type and container type dropdowns
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
        const data = {
          id: Date.now(),
          totalAmount,
          drinklabel: values.container,
        };
        const newData = { [values.drinkType]: arrayUnion(data) };
        await setDoc(docRef, newData, { merge: true });

        if (onDataUpdated) {
          onDataUpdated();
        }
        toast.success("Drink details added successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to add drink details.");
      } finally {
        setShowDrinkModal(false);
        dispatch(hideLoader());
      }
    },
  });

  return (
    <div>
      <button className="close-button" onClick={() => setShowDrinkModal(false)}>
        X
      </button>
      <h2 className="modal-title" style={{ color: "black" }}>
        {editToggle ? "Update Drink Details" : "Add Drink Details"}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Drink Type */}
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

        {/* Container Type */}
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

        {/* Quantity */}
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
          {editToggle ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DrinkModal;
