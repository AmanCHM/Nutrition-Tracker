import React from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Table = ({
      logData,
      handleNutritionModal,
      handleEditLog,
      handleDeleteLog,
      showFeature ,
}) => {
  return (
    <>
      <section className="view-data">
              <div className="meal-log">
                <h2
                  style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.5rem" }}
                >
                  {" "}
                  Your Food Diary
                </h2>
      
                <div className="meal-section">
                  <div>
                    <label className="table-label">
                      <strong>BreakFast </strong> 
                      {/* {breakfastCalorie} kcal */}
                    </label>
                  </div>
      
                  <div>
                    <table className="meal-table">
                      <thead>
                        <tr>
                          <th>Food Name</th>
                          <th>Proteins (g)</th>
                          <th>Carbs (g)</th>
                          <th>Fats (g)</th>
                          <th>Calories (kcal)</th>
                          { showFeature && 
                          <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {logData?.Breakfast?.length > 0 ? (
                          logData.Breakfast.map((item, index) => (
                            <tr key={`breakfast-${index}`}>
                              <td>
                                <span onClick={() => handleNutritionModal(item.name)}>
                                 <strong> {item.name?.charAt(0).toUpperCase() + item.name?.slice(1) }</strong>
                                </span>
                              </td>
                              <td>{item.proteins}</td>
                              <td>{item.carbs}</td>
                              <td>{item.fats}</td>
                              <td>{item.calories}</td>
                              { showFeature && 
                              <td>
                                <div style={{ display: "flex" }}>
                                  <span
                                    onClick={() =>
                                      handleDeleteLog("Breakfast", item.id)
                                    }
                                    className="icon-button delete"
                                  >
                                    <FaTrashAlt style={{ color: "#e15f41" }} />
                                  </span>
                                  <span
                                    onClick={() =>
                                      handleEditLog("Breakfast", item.name, item.id)
                                    }
                                    className="icon-button edit"
                                  >
                                    <FaEdit />
                                  </span>
                                </div>
                              </td>}
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
                </div>
                <div className="meal-section">
                  <label className="table-label">
                    <strong>Lunch </strong>
                    {/* {lunchCalorie} kcal */}
                  </label>
                  <table className="meal-table">
                    <thead>
                      <tr>
                        <th>Food Name</th>
                        <th>Proteins (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fats (g)</th>
                        <th>Calories (kcal)</th>
                        { showFeature && 
                          <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {logData?.Lunch?.length > 0 ? (
                        logData.Lunch.map((item, index) => (
                          <tr key={`lunch-${index}`}>
                            <td>
                              <span
                                // style={{ backgroundColor: "#0077b6" }}
                                onClick={() => handleNutritionModal(item.name)}
                              >
                             <strong> {item.name?.charAt(0).toUpperCase() + item.name?.slice(1) }</strong>
                              </span>
                            </td>
                            <td>{item.proteins}</td>
                            <td>{item.carbs}</td>
                            <td>{item.fats}</td>
                            <td>{item.calories}</td>
                         
                            { showFeature && 
                              <td>
                         
                            <div style={{ display: "flex" }}>
                              <span
                                onClick={() => handleDeleteLog("Lunch", item.id)}
                                className="icon-button delete"
                              >
                                <FaTrashAlt style={{ color: "#e15f41" }} />
                              </span>
                              <span
                                onClick={() =>
                                  handleEditLog("Lunch", item.name, item.id)
                                }
                                className="icon-button edit"
                              >
                                <FaEdit />
                              </span>
                            </div>
                            </td>}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">No lunch items</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
      
                <div className="meal-section">
                  <label className="table-label">
                    <strong>Snack </strong>
                    {/* {snackCalorie} kcal */}
                  </label>
                  <table className="meal-table">
                    <thead>
                      <tr id="header-color">
                        <th>Food Name</th>
                        <th>Proteins (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fats (g)</th>
                        <th>Calories (kcal)</th>
                        { showFeature && 
                          <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {logData?.Snack?.length > 0 ? (
                        logData.Snack.map((item, index) => (
                          <tr key={`snack-${index}`}>
                            <td>
                              <span
                                // style={{ backgroundColor: "#0077b6" }}
                                onClick={() => handleNutritionModal(item.name)}
                              >
                                <strong> {item.name?.charAt(0).toUpperCase() + item.name?.slice(1) }</strong>
                              </span>
                            </td>
                            <td>{item.proteins}</td>
                            <td>{item.carbs}</td>
                            <td>{item.fats}</td>
                            <td>{item.calories}</td>
                            { showFeature && 
                              <td>
                            <div style={{ display: "flex" }}>

                              <span
                                onClick={() => handleDeleteLog("Snack", item.id)}
                                className="icon-button delete"
                              >
                                <FaTrashAlt style={{ color: "#e15f41" }} />
                              </span>
                              <span
                                onClick={() =>
                                  handleEditLog("Snack", item.name, item.id)
                                }
                                className="icon-button edit"
                              >
                                <FaEdit />
                              </span>
                            </div>
                            </td>}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">No snack items</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
      
                <div className="meal-section">
                  <label className="table-label">
                    {" "}
                    <strong>Dinner </strong>
                    {/* {dinnerCalorie} kcal */}
                  </label>
                  <table className="meal-table">
                    <thead>
                      <tr>
                        <th>Food Name</th>
                        <th>Proteins (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fats (g)</th>
                        <th>Calories (kcal)</th>
                        { showFeature && 
                          <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {logData?.Dinner?.length > 0 ? (
                        logData.Dinner.map((item, index) => (
                          <tr key={`dinner-${index}`}>
                            <td>
                              <span
                                // style={{ backgroundColor: "#0077b6" }}/
                                onClick={() => handleNutritionModal(item.name)}
                              >
                               <strong> {item.name?.charAt(0).toUpperCase() + item.name?.slice(1) }</strong>
                              </span>
                            </td>
                            <td>{item.proteins}</td>
                            <td>{item.carbs}</td>
                            <td>{item.fats}</td>
                            <td>{item.calories}</td>
                            { showFeature && 
                              <td>
                            <div style={{ display: "flex" }}>
                              <span
                                onClick={() => handleDeleteLog("Dinner", item.id)}
                                className="icon-button delete"
                              >
                                <FaTrashAlt style={{ color: "#e15f41" }} />
                              </span>
                              <span
                                onClick={() =>
                                  handleEditLog("Dinner", item.name, item.id)
                                }
                                className="icon-button edit"
                              >
                                <FaEdit />
                              </span>
                            </div>
                            </td>}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">No dinner items</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </section>
    </>
  )
}

export default Table;
