// Libraries
import React from "react";

// Styling
import "./PaginationDropDown.css";

function PaginationDropDown(props) {
    const { setSortValue, sortValue, sort, pageIndex, theme } = props;

    /**
     * Calls sort method which re-sorts the content-belt order
     * @param {*} e
     */
    const twoCalls = (e) => {
        console.log(theme);
        setSortValue(e.target.value);
        pageIndex.current = 0;
        sort(e.target.value);
    };

    return (
        <div className="dropdown-wrapper">
            <select
                className="sort-select"
                type="select"
                onChange={(e) => twoCalls(e)}
                value={sortValue}
                style={
                    theme == "dark"
                        ? {
                              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          }
                        : {
                              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          }
                }
            >
                {" "}
                <option value={1}>Most Recent</option>
                <option value={2}>Oldest</option>
                <option value={3}>Difficulty: Low-High</option>
                <option value={4}>Difficulty: High-Low</option>
                <option value={5}>Name: A-Z</option>
                <option value={6}>Name: Z-A</option>
            </select>
        </div>
    );
}

export default PaginationDropDown;
