// Libraries
import React from "react";
import { useState, useRef } from "react";
import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

// Icons
import { ReactComponent as ImportIcon } from "../../../assets/bx-upload.svg";

// Styling
import "./Profile.css";

// Config
import { port, fullurl } from "../../../Config";

// Components
import ContentBelt from "../../modals/ContentBelt/ContentBelt";
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ProfilePage(props) {
    const {
        get_login_state,
        set_login_state,
        checkAccessToken,
        setLocalStorageUser,
        theme,
    } = props;

    

    let [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // type = 0 if user is viewing their own profile page; type = 1 if user is viewing another user's profile page
    let type;
    try {
        type = location.state.type;
    } catch (e) {
        type = 1;
    }

    let fedapi;
    try {
        fedapi = location.state.fedapi;
    } catch (err) {
        fedapi = 0;
    }

    // Retrieve user name from URL
    const username = searchParams.get("user");

    // used for conditionally rendering this page component
    const [canRender, setCanRender] = useState(0);

    const [pfp, setPfp] = useState("");
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    //logout functionality
    const logout = (flag) => {
        set_login_state(0);
        localStorage.clear();
        if (flag) {
            navigate("/LoggedOut");
        } else {
            navigate("/");
        }
    };


    // retrieves user data from backend
    const getUserData = async () => {
        try {
            const res = await Axios({
                method: "POST",
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
                data: {
                    username: username,
                    accessToken: localStorage.getItem("accessToken"),
                },
                url: fullurl + "/userdata",
            });

            let data = res.data;

            // Set profile picture
            console.log(data.avatar)
            setImage(fullurl + data.avatar);

            if (type == 0) {
                setLocalStorageUser(data);
            }

            setUserData(data);
            setCanRender(1);
        } catch (err) {
            console.error("Status 500");
            console.log(err)
            // logout(0);
        }
    };

    // For updating the users profile picture
    const setImage = (url) => {
        var image = new Image();
        image.onload = () => {
            if (image.width > 0) {
                // Use the SVG
                setPfp(url);
            }
        };
        image.onerror = () => {
            // Set image
            setPfp(
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFeElEQVRoQ+2ZgZUUNwyGjwpCKshSAaQClgpyVMBSQUgFDBUkVMCmgkAFDBUAFWSogKSCoI9n3/MJ2ZJnvDkerN7T270dW9IvyZI8d+viO6Nb3xneizPgbz3i5wgPjvBtkXdf+J7wPsnOn1nVnL7w+U74jfA/g+24EneKCAPyF+EnCega2wF/FH41GvxIwAD9NQHl+wgi0n8IPx8FfBTgp2LQNAJhRUYG/myrjq2AOZt/Ce+2GhLcv8i6h8Kc9VW0BTDpS7p59F4WzMlIDOZ7SfvkMJx3KfyTJ1CeUx9I825aC/iFaDo0tP0rz47JIYDsIYAjG/6hsRH5j3sEs3YNYA8s54zIb20tFD4iSX2oUTfoXsAtsPRPotIbUS9IO1kAMPq5RV2gewDj7d8rSonq5Fm+8Tnya9H+LWWVqyIKmHP1tiKNc4SXW5SHEYoSsogatAhTcV8KR4aMg6wjyyz6OclqGhIF/HdhZCkwAnaSDVR0bxjhzLPWq7410DjvThOtPIwAxggrlbw0BiBHAAN76CiLSdFW0Vtrkwt4J4qJriYK1N5BgeGPepAWa9nrtZxZ1uhChpOIctVZXoRrnkTo0gBT29eD3ytEtWA0M68FmJQkuvrsRVLZ2gfYP4Xp0Xk0pIBR/a1McKMl+yzHNve1AB9EoK6ITFB4tnW+rH2AbRW4NXuQSTDIND2RVXW1ANOGiEBJVFAi0iJaDPfhkogsoFp0lIc60rQqWlmLyBi6QEnVfTXAeO6jocU7u2wh+trjkR5p9fpFZHmtpjYj/JhsuQajBhivcu0riVuPjrjl+f+MH73imLes3Ytj9C2LayTZFgI8ySrdeyPpjPC1Rm/Za6W1WVxrnp9Fu+5xkalqdEp/EIE7K43Ubwf5WxdY8xz3AH4gQnGER/930cKevfBrZZg5HNUAb0lLqrh1qzpFWyoxhmw+BeBab8S4ozC1oBw8aCmkpKZIz/8qAGPEJNx6U+EdC557o6WWMTzCkV5aGkE0114eIoNKqcvqxWSIHourt6VZFusqHS1a2RCU0S56QQOWOtAaX3V09/LDpqJlAY62JW0MxpPirTeQ7CEirMNJvXSQDZvaEor1GexNs9Joos30BpN+eSqiz1LAaGVwT1RL+Uf5Q2dS1+BhjZaLCPXm2t7IjFrP3K/Pa9doWbs89BYuABFR6sEXBUShJboMC7llRZ0x5PKAsjkZWiqOztOAy/11F7U8rSOTSNHofwytOdqcspDfusVYExNRIK1bZw2gUyCinh/QgZzWW0wca71dqfbwFmCE4W1dXVvFi0p58JB0PifadAiLeKaLVXNC8+6pVrqg2HoRcAqwGaQFepeiqx3RPHYeYIRSRHSU+Y0ClmmSL61RkquaV4woPvrVUAlGtxnrFRTRRc5SyyIPMPtqYLLX97JGTzlZH94mS6oGKMNwMLVDv6PKy/K0V8sms/eWOiKAOctER79CQQ7FgagAWtPayQw5B2E9OfH7LEy2WNfP0MuCCGAU1XqdgfPzT66naxuL3yf53nPjCs0IUcDYYbUpy+6QpwOAWbIIW5mlt4evkj2AUXIU9m4/YeUB0BEnd834vYAjoClSpPTai0D2A7WDlAZ0jbrAImQNYPbV+nM2DLBkAwZ57UiDoV6QRQdhQNcoOuZe278WMEIwyKqk2kAAzwn4Ip/MuSVxsdgJA3SfPhs4Pz9a3QG2AEYxRh6F73oWDnrOfz9wdG/WXKnfCjgL4pxNwt5bjbW4t7wNuaZzFGCEkpYAJwKjgAOUDOqZ1ppOHQk4K6LQXCbwa1Od1AXkS+Gt1f5kEbY8C/h9Ys57zoTyndaSfs/FbR4NsjTsFBFuptRNPzwDvukInFr/OcKn9vBNy/8EzkQ0TBBWt60AAAAASUVORK5CYII"
            );
        };
        image.src = url;
    };

    //retrieve users data
    useLayoutEffect(() => {
        if (get_login_state() == 0) {
            navigate("/login");
        }

        // If A fed user 
        if (fedapi == 1) {
            type = 1;
            const fedUserData = {
                userid : localStorage.getItem("userid"),
                username : localStorage.getItem("username"),
                firstname : localStorage.getItem("firstname"),
                groupcreated : localStorage.getItem("group"),
                surname : "",
                lastname : "",
                xp : 0,
            }

            setUserData(fedUserData);
            console.log(userData)
            setCanRender(1);
        }
        // If the user's access token as expired, log them out and send them to session expired page
        else if (type == 0 && !checkAccessToken() && localStorage.getItem("loginState") == 1) {
            console.log("ONE")
            logout(0);
        } else if ( type == 0 && !checkAccessToken()) {
            console.log("TWo")
            // If user is not logged in, send them to home page
            logout(1);
        } else {
            // Otherwise retrieve the users data from backend
            getUserData();
        }
    }, []);

    // End point for changing profile image - sends new image to back end
    const changePfp = async () => {
        const file = document.getElementById("input_img");
        const form = new FormData();
        form.append("image", file.files[0]);

        try {
            const res = await Axios({
                method: "POST",
                withCredentials: true,
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
                data: form,
                url: fullurl + "/upload",
            });

            const { url } = res.data;

            // Contact the database
            const res2 = await Axios({
                method: "POST",
                withCredentials: true,
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
                data: { userid: userData.userid, url: url },
                url: fullurl + "/changePfp",
            }).then(function (response) {
                // Update on page
                setPfp(fullurl + url);
            });
        } catch (err) {
            console.error(err);
        }
    };

    // Event handler for clicking on change profile image button
    const changePfpButton = () => {
        document.getElementById("input_img").click();
    };

    // Event handler for clicking on upload puzzle button
    const uploadButton = () => {
        document.getElementById("input_file").click();
    };


     // Converts puzzle data from array of string to array
     const convertFedPuzzle = (puzzleData) => {
        let newPuzzleData = []
        for (let i = 0; i < puzzleData.length; i++) {
            let row = []
            for (let j = 0; j < puzzleData.length; j++){
                if (puzzleData[i][j] == ""){
                    row.push(0)
                }
                else{
                    row.push(parseInt(puzzleData[i][j]))
                }
            }
            newPuzzleData.push(row);
        }
        return JSON.stringify(newPuzzleData);
    }

    // Handler for uploading puzzle files to the platform - is called by upload button
    const puzzleUpload = (e) => {
        var file = document.getElementById("input_file");
        var jsonString = file.files[0];

        const reader = new FileReader();

        reader.onload = async (file) => {
            // Read file
            const contents = file.target.result;

            // Convert to object
            //const jsonObject = eval(contents);
            const jsonObject = JSON.parse(contents);
            
            // Send imported puzzle data to backend
            try {
                const res = await Axios({
                    method: "POST",
                    withCredentials: true,
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("accessToken"),
                    },
                    data: {
                        userid: localStorage.getItem("userid"),
                        accessToken: localStorage.getItem("accessToken"),
                        puzzlename: "A puzzle from " + jsonObject.author_id,
                        puzzledata: eval(await convertFedPuzzle(jsonObject.puzzle)),
                        solution: eval(await convertFedPuzzle(jsonObject.solution)),
                        puzzletype: "sudoku",
                        bgCSS: "RGB(0,255,0)",
                        puzzleImage: "",
                        difficulty:jsonObject.difficulty
                    },
                    url: fullurl + "/addPuzzle",
                });
            } catch (err) {
                console.error(err);
            }
        };

        reader.readAsText(jsonString);
    };

    if (canRender == 1) {
        
        // XP calculations
        const xp = type == 0 ? localStorage.getItem("xp") : userData.xp;
        const level = Math.floor((-17 + Math.sqrt(224 * xp + 289)) / 14);
        const levelNext = level + 1; // This is not a state variable, please dont change it again

        const xpThisLevel = 0.875 * level ** 2 + 2.125 * level;
        const xpToNextLevel = 0.875 * levelNext ** 2 + 2.125 * levelNext;

        console.log(pfp)

        return (
            <div className="profilepage-wrapper">
                <h1 className="profile-title">Profile</h1>
                <div className="center">
                    <div className="profile-item bio">
                        <div className="bio-item row-one">
                            <div className="row-one-item username">
                                <div className="profile-container">
                                    <img
                                        className="pfp"
                                        src={
                                            type == 0
                                                ? fullurl +
                                                  localStorage.getItem("avatar")
                                                : pfp
                                        }
                                    />
                                    {type == 0 && fedapi == 0 && (
                                        <>
                                            <div
                                                className="changePfp"
                                                onClick={changePfpButton}
                                            ></div>
                                            <input
                                                type="file"
                                                id="input_img"
                                                style={{ display: "none" }}
                                                onChange={(e) => changePfp(e)}
                                                accept="image/*"
                                            ></input>
                                        </>
                                    )}
                                </div>

                                <h1>
                                    @
                                    {type == 0
                                        ? localStorage.getItem("username")
                                        : userData.username}
                                </h1>
                            </div>
                        </div>

                        <div className="details-info">
                            <div className="row-two-items">
                                <h2>
                                    <span className="underline">
                                        {"Name: "}
                                        <span className="light">
                                        {type != 0
                                            ? userData.fname +
                                              " " +
                                              userData.sname
                                            : localStorage.getItem(
                                                  "firstname"
                                              ) +
                                              " " +
                                              localStorage.getItem("surname")}
                                        </span>
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {type == 0 && (
                            <div className="details-info row-three">
                                <div className="row-three-item">
                                    <h2>
                                        <span className="underline">
                                            Email:
                                        </span>
                                        <span className="light">
                                            {" "}
                                            {type == 0
                                                ? localStorage.getItem("email")
                                                : userData.email}
                                        </span>
                                    </h2>
                                </div>
                            </div>
                        )}

                        <div className="details-info row-four">
                            <div className="row-four-item">
                                <h2>
                                    <span className="underline">Group:</span>
                                    <span className="light">
                                        {" "}
                                        {type == 0 ? localStorage.getItem("group") : userData.groupcreated}
                                    </span>
                                </h2>
                            </div>
                        </div>
                            <div className="bio-item row-five">
                                <div className="row-five-item">
                                    {/* https://www.npmjs.com/package/react-circular-progressbar */}
                                    <div
                                        title={
                                            Math.ceil(
                                                xpToNextLevel - xpThisLevel
                                            ) + "xp until level up"
                                        }
                                        className="level-ring"
                                    >
                                        <CircularProgressbarWithChildren
                                            background={false}
                                            backgroundPadding={5}
                                            strokeWidth={10}
                                            minValue={xpThisLevel}
                                            value={xp}
                                            maxValue={xpToNextLevel}
                                            styles={{
                                                // Customize the root svg element
                                                root: {},
                                                // Customize the path, i.e. the "completed progress"
                                                path: {
                                                    // Path color
                                                    stroke: "#00ffff",
                                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                    strokeLinecap: "butt",
                                                    // Customize transition animation
                                                    transition:
                                                        "stroke-dashoffset 0.5s ease 0s",
                                                    // Rotate the path
                                                    transform: "rotate(0turn)",
                                                    transformOrigin:
                                                        "center center",
                                                },
                                                // Customize the circle behind the path, i.e. the "total progress"
                                                trail: {
                                                    // Trail color
                                                    stroke: "rgba(62, 152, 199, 100)",
                                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                    strokeLinecap: "butt",
                                                    // Rotate the trail
                                                    transform: "rotate(0turn)",
                                                    transformOrigin:
                                                        "center center",
                                                },
                                                // Customize the text
                                                text: {
                                                    // Text color
                                                    fill: "#000",
                                                    // Text size
                                                    fontSize: "24px",
                                                },
                                                // Customize background - only used when the `background` prop is true
                                                background: {
                                                    fill: "#fff",
                                                },
                                            }}
                                        >
                                            <div className="inner-circle-new">
                                                <h2 className="level-label">
                                                    lvl
                                                </h2>
                                                <div className="circle-text">
                                                    <h1 className="level-text">
                                                        {level}
                                                    </h1>
                                                </div>
                                            </div>

                                            <p className="xp-label">
                                                {"(" + xp + "xp)"}
                                            </p>
                                        </CircularProgressbarWithChildren>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="elevation">
                                    {type != 0
                                                ? userData.accountelevation == 0
                                                    ? "Solver"
                                                : userData.accountelevation == 1
                                                ?    "Author"
                                                : userData.accountelevation == 2
                                                    ? "Moderator"
                                                : "Admin"


                                                : localStorage.getItem("elevation") == 0
                                                    ? "Solver"
                                                : localStorage.getItem("elevation") == 1
                                                    ? "Author"
                                                : localStorage.getItem("elevation") == 2
                                                    ? "Moderator"
                                                : "Admin"}

                                </div>
                            </div>
                        
                    </div>
                </div>

                {type == 0 ? (
                    <div>
                        {level >= 1 && fedapi == 0 ? (
                            <div className="flex-col">
                                <Link
                                    className="createpuzzle-btn"
                                    to="/CreatePuzzle"
                                >
                                    Create Puzzle
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAXElEQVRIS2NkoDFgpLH5DKMWEAxhkoLoPxCATGQEAoImQxUQrRCkftQCgsE6dIII5lKCXkJTgC11YU1FNLcAl8uHThyM+gA5BAZXWURqvgCXvORoIkXPqAUEQwsAVoQ4Gad6WJkAAAAASUVORK5CYII=" />
                                </Link>
                            </div>
                            
                        
                        ) : (
                            <div className="flex-col">
                                <button
                                    className="createpuzzle-btn"
                                    style={{ background: "gray" }}
                                    title="Unlocks at lvl 1!"
                                >
                                    Create Puzzle
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAXElEQVRIS2NkoDFgpLH5DKMWEAxhkoLoPxCATGQEAoImQxUQrRCkftQCgsE6dIII5lKCXkJTgC11YU1FNLcAl8uHThyM+gA5BAZXWURqvgCXvORoIkXPqAUEQwsAVoQ4Gad6WJkAAAAASUVORK5CYII=" />
                                </button>
                                <p style={{ color: "red", marginTop: "6px" }}>
                                    Creating puzzles unlocks at level 1!
                                </p>
                            </div>
                            
                        
                        )}
                        { fedapi == 0 &&
                            <button
                                onClick={(e) => uploadButton(e)}
                                className="createpuzzle-btn"
                                style={{ marginTop: "1rem" }}
                            >
                                Import Puzzle
                                <ImportIcon style={{ marginLeft: "8px" }} />
                            </button>
                        }
                        <input
                            type="file"
                            id="input_file"
                            style={{ display: "none" }}
                            onChange={(e) => puzzleUpload(e)}
                            accept="application/JSON"
                        ></input>

                        <ContentBelt
                            name="Your Puzzles"
                            type="yourpuzzles"
                            theme={theme}
                        />
                        <ContentBelt
                            theme={theme}
                            name="Continue Solving"
                            type="progresspuzzles"
                        />

                        <div className="flex-col">
                            <div
                                className="logout-btn"
                                type="button"
                                onClick={() => logout(0)}
                            >
                                {" "}
                                Logout
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA1ElEQVRIS2NkoDFgpLH5DIPDgv///zsAfTofiBWI8PEDoJpERkbGAyC1RPkAaAFIkzwRhsOUPABaoEiKBf/BioGAkCVAx6CoJagBZCC6JnyWDA0LgK6cDfRFNjDEfqH7hiwf4DDkBFA8CGjJc2R5aloAMhdkOMgSkGVgQNACmAJCqQVJHhRMoOCaMzgsIMblSL4kPYhIsIB6kYwecVRPpsMvJ9OiLPoANJSfmAQAVfMQmC8UwCUwMZqgFc4CoFpi6oSHQHUJJFU4xDgClxqifDCoLQAAvYqcGac69akAAAAASUVORK5CYII=" />
                            </div>
                        </div>
                    </div>
                ):
                <ContentBelt
                name={userData.username+"'s Puzzles"}
                type="userspuzzles"
                theme={theme}
                user={userData.username}
                />
                }
            </div>
        );
    }
}

export default ProfilePage;
