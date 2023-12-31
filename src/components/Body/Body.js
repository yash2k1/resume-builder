import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { ArrowDown } from "react-feather";

import Editor from "../Editor/Editor";
import Resume from "../Resume/Resume";
import styles from "./Body.module.css";
import { useMediaQuery } from 'react-responsive';

function Body() {
  const colors = ["#239ce2", "#48bb78", "#0bc5ea", "#a0aec0", "#ed8936"];
  const isMobileDevice = useMediaQuery({
    query: "(min-device-width: 480px)",
  });
  const [showClearBtn,setClearBtn] = useState(false);
  const sections = {
    basicInfo: "Basic Info",
    workExp: "Work Experience",
    project: "Projects",
    education: "Education",
    achievement: "Achievements",
    summary: "Summary",
    other: "Other",
  };
  const resumeRef = useRef();

  const [activeColor, setActiveColor] = useState(colors[0]);
  
  useEffect(() => {
    const container = resumeRef.current;
    if (!container) return;
    container.style.setProperty("--color", activeColor);
  }, [activeColor]);

  
  const initialState = {
    [sections.basicInfo]: {
      id: sections.basicInfo,
      sectionTitle: sections.basicInfo,
      detail: {},
    },
    [sections.workExp]: {
      id: sections.workExp,
      sectionTitle: sections.workExp,
      details: [],
    },
    [sections.project]: {
      id: sections.project,
      sectionTitle: sections.project,
      details: [],
    },
    [sections.education]: {
      id: sections.education,
      sectionTitle: sections.education,
      details: [],
    },
    [sections.achievement]: {
      id: sections.achievement,
      sectionTitle: sections.achievement,
      points: [],
    },
    [sections.summary]: {
      id: sections.summary,
      sectionTitle: sections.summary,
      detail: "",
    },
    [sections.other]: {
      id: sections.other,
      sectionTitle: sections.other,
      detail: "",
    },
  };
  const [resumeInformation, setResumeInformation] = useState(initialState);
  useEffect(() => {
    let item = JSON.parse(localStorage.getItem('information'));
    if(item && localStorage.getItem('information') !== JSON.stringify(resumeInformation)) {
      setClearBtn(true);
      setResumeInformation(item);
    }
  },[])

  useEffect(() => {
    localStorage.setItem('information',JSON.stringify(resumeInformation));
  },[resumeInformation]);

  function clearResume(){
    setResumeInformation(initialState);
    setClearBtn(false);
  }
  return (
    <div  className={styles.container}>
      <p className={styles.heading}>Resume Builder</p>
      <div className={[styles.toolbar, isMobileDevice ? styles.Desk : styles.Mob].join(' ')}>
        <div id="colorPallet" ref={resumeRef} className={styles.colors}>
          {colors.map((item) => (
            <span 
              key={item}
              style={{ backgroundColor: item }}
              className={`${styles.color} ${
                activeColor === item ? styles.active : ""
              }`}
              onClick={() => setActiveColor(item)}
            />
          ))}
        </div>
        <div className={styles.navButtons}> 
        <p className={styles.btnOuter}>
          {showClearBtn ? <button onClick={clearResume}>Clear</button> : null}
        </p>
        <ReactToPrint
          trigger={() => {
            return (
              <button>
                Download <ArrowDown />
              </button>
            );
          }}
          content={() => resumeRef.current}
        />
        </div>
        
      </div>
      <div className={isMobileDevice ? styles.mainM : styles.mainD}>
        <Editor
          sections={sections}
          information={resumeInformation}
          setInformation={setResumeInformation}
        />
        <Resume
          ref={resumeRef}
          sections={sections}
          information={resumeInformation}
          activeColor={activeColor}
        />
      </div>
    </div>
  );
}

export default Body;
