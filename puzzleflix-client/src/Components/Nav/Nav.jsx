// Libraries
import React from "react";
import { Link } from "react-router-dom";

// Styling
import "./nav.css";

// Assets
import { ReactComponent as Queen } from "../../assets/queen2.svg";
import DesktopLogo from "../../assets/logo-full.svg";
import DesktopLogoWhite from "../../assets/logo-full-white.svg";
import SearchSvg from "../../assets/search.svg";
import SearchWhiteSvg from "../../assets/search-white.svg";
import ProfileSvg from "../../assets/profile.svg";
import ProfileWhiteSvg from "../../assets/profile-white.svg";
import Sun from "../../assets/sun.svg";
import Moon from "../../assets/moon.svg";

// Components
import SearchDropDown from "../modals/SearchDropDown/SearchDropDown";

function Nav(props) {
    const { get_login_state, setLoginState, theme, handleToggle } = props;

    return (
        <div>
            <nav>
                <div className="nav-logo">
                    {theme === "light" ? (
                        <Link to="/">
                            <img
                                className="nav-logo-img logo-desktop"
                                src={DesktopLogo}
                                alt="PuzzleFlix logo"
                            />
                        </Link>
                    ) : (
                        <Link to="/">
                            <img
                                className="nav-logo-img logo-desktop"
                                src={DesktopLogoWhite}
                                alt="PuzzleFlix logo"
                            />
                        </Link>
                    )}
                </div>
                <div className="links">
                    <SearchDropDown theme={theme} />

                    <Link
                        to="/EightQueen"
                        aria-label="Eight Queen Puzzle"
                        className="flex-link"
                    >
                        <Queen className="nav-queen" />
                    </Link>

                    {theme === "light" ? (
                        <button
                            aria-label="theme-toggle"
                            className="theme rel"
                            onClick={handleToggle}
                        >
                            <img src={Sun} alt="" />
                        </button>
                    ) : (
                        <button
                            aria-label="theme-toggle"
                            className="theme rel"
                            onClick={handleToggle}
                        >
                            <img src={Moon} alt="" />
                        </button>
                    )}

                    {theme == "light" ? (
                        <div className="profile">
                            {get_login_state() ? (
                                <Link
                                    to={
                                        "/Profile/?user=" +
                                        localStorage.getItem("username")
                                    }
                                    state={{ type: 0, fedapi:localStorage.getItem("fedapi") }}
                                >
                                    <img
                                        className="profile"
                                        src={ProfileSvg}
                                        alt=""
                                    />
                                </Link>
                            ) : (
                                <Link className="login" to="/Login">
                                    Login
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="profile">
                            {get_login_state() ? (
                                <Link
                                    to={
                                        "/Profile/?user=" +
                                        localStorage.getItem("username")
                                    }
                                    state={{ type: 0, fedapi:localStorage.getItem("fedapi") }}
                                >
                                    <img
                                        className="profile"
                                        src={ProfileWhiteSvg}
                                        alt=""
                                    />
                                </Link>
                            ) : (
                                <Link className="login" to="/Login">
                                    Login
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            <nav className="nav-mobile">
                <div className="nav-logo">
                    {theme === "light" ? (
                        <Link to="/">
                            <img
                                className="nav-logo-img"
                                src={DesktopLogo}
                                alt="PuzzleFlix logo"
                            />
                        </Link>
                    ) : (
                        <Link to="/">
                            <img
                                className="nav-logo-img"
                                src={DesktopLogoWhite}
                                alt="PuzzleFlix logo"
                            />
                        </Link>
                    )}

                    <div className="profile">
                        <Link aria-label="Eights Queen Puzzle" to="/EightQueen">
                            <Queen className="nav-queen" />
                        </Link>
                        {theme === "light" ? (
                            <button
                                aria-label="theme-toggle"
                                className="theme rel"
                                onClick={handleToggle}
                            >
                                <img src={Sun} alt="" />
                            </button>
                        ) : (
                            <button
                                className="theme rel"
                                aria-label="theme-toggle"
                                onClick={handleToggle}
                            >
                                <img src={Moon} alt="" />
                            </button>
                        )}

                        {theme == "light" ? (
                            <div className="profile">
                                {get_login_state() ? (
                                    <Link to="/Profile">
                                        <img
                                            className="profile"
                                            src={ProfileSvg}
                                            alt=""
                                        />
                                    </Link>
                                ) : (
                                    <Link className="login" to="/Login">
                                        Login
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="profile">
                                {get_login_state() ? (
                                    <Link to="/Profile">
                                        <img
                                            className="profile"
                                            src={ProfileWhiteSvg}
                                            alt=""
                                        />
                                    </Link>
                                ) : (
                                    <Link className="login" to="/Login">
                                        Login
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <SearchDropDown theme={theme} />
            </nav>
        </div>
    );
}

export default Nav;
