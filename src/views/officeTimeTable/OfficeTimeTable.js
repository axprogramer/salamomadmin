import React, { useEffect, useState, useRef } from "react";
import firebase from '../../components/firebaseConfig';
import { getDatabase, ref, set, update, remove, push, onValue } from "firebase/database";
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import Form from 'react-bootstrap/Form';
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowThickBottom, cilDataTransferDown, cilPen, cilPlus, cilSearch, cilTrash, cilUser } from "@coreui/icons";
import { CButton, CModal, CModalBody, CModalFooter, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from "@coreui/react";
import { color } from "chart.js/helpers";

const OfficeTimeTable = () => {
  const db = getDatabase();

  //Array
  const [dataSubject, setdataSubject] = useState([])
  const [dataLevel, setdataLevel] = useState([])
  const [dataYear, setdataYear] = useState([])
  const [mainData, setmainData] = useState([])
  const [dataStaff, setdataStaff] = useState([])
  const [dataEn, setdataEn] = useState([])
  const [dataEn1, setdataEn1] = useState([])
  const [dataEn2, setdataEn2] = useState([])
  const [dataEn3, setdataEn3] = useState([])
  const [Title, setTitle] = useState([])
  const [mainTimeTable, setmainTimeTable] = useState([])
  const [gradeTitle, setgradeTitle] = useState([])
  const [TitleEn, setTitleEn] = useState([])
  const [gradeTitleEn, setgradeTitleEn] = useState([])
  // const combinedArrayEn = dataEn1.concat(...dataEn2, ...dataEn3)
  useEffect(() => {
    const combinedArrayEn = dataEn1.concat(...dataEn2, ...dataEn3);

    setdataEn(combinedArrayEn);
  }, [dataEn1, dataEn2, dataEn3]);
  const subInKh = useRef(null);//Get from select and from input
  const subInEn = useRef(null);
  const subInAbr = useRef(null);
  // const getT_grade = useRef(null);
  // const getteacher_type = useRef(null);
  const [myId, setmyId] = useState('')
  const [getHeadTeacher, setgetHeadTeacher] = useState('')
  const [getteacher_type, setgetteacher_type] = useState('')
  const [upgradeYear, setupgradeYear] = useState(localStorage.getItem('yearUpgrade'))
  const [getT_grade, setgetT_grade] = useState('')
  const [khYear, setkhYear] = useState(localStorage.getItem('outlineKhYear'))
  const [selectTimeTable, setselectTimeTable] = useState(localStorage.getItem('New_Time_Table') || 'default')
  const [selectTimeTableYear, setselectTimeTableYear] = useState(localStorage.getItem('New_Time_Table_Year') || 'default')

  const [data, setdata] = useState([])
  const [dbPreview, setdbPreview] = useState([]);

  const [userType, setuserType] = useState('');
  const [subjectChecks, setsubjectChecks] = useState('');


  const BtnUpdate = useRef('')
  const BtnPush = useRef('')
  const BtnDelete = useRef('')

  const tableRef = useRef(null); // Reference to the table
  const [textCellCount, setTextCellCount] = useState(0);

  useEffect(() => {
    const db2 = getDatabase();
    const mainDb = ref(db2, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/` + `${selectTimeTable}`);
    const mainTimeTable = ref(db2, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/`);
    const mainDbSecondary = ref(db2, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/`);
    const mainDbHigh = ref(db2, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/`);
    const enmainDbPrimary = ref(db2, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/បឋមសិក្សា/`);
    const enmainDbSecondary = ref(db2, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/អនុវិទ្យាល័យ/`);
    const enmainDbHigh = ref(db2, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/វិទ្យាល័យ/`);
    const mainDatabase = ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/`);
    onValue(mainDb, (data) => {
      const dataSet = data.val();
      setmainData(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    onValue(enmainDbPrimary, (data) => {
      const dataSet = data.val();
      setdataEn1(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    onValue(enmainDbSecondary, (data) => {
      const dataSet = data.val();
      setdataEn2(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    onValue(enmainDbHigh, (data) => {
      const dataSet = data.val();
      setdataEn3(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    onValue(mainTimeTable, (data) => {
      const dataSet = data.val();
      setmainTimeTable(dataSet)
      // setmainTimeTable(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    onValue(mainDatabase, (data) => {
      data.forEach(d => {
        var id = d.val().nickname
        var t_type = d.val().teacher_type
        var permission = d.val().permission
        var t_grade = d.val().t_grade
        var nickname = d.val().nickname
        var name = d.val().id
        setTimeout(() => {
          const tdElements1 = document.querySelectorAll(`.` + `${id}` + 'time1');
          const tdElements2 = document.querySelectorAll(`.` + `${id}` + 'time2');
          const tdElements3 = document.querySelectorAll(`.` + `${id}` + 'time3');
          const tdElements4 = document.querySelectorAll(`.` + `${id}` + 'time4');
          const tdElements5 = document.querySelectorAll(`.` + `${id}` + 'time5');
          let count1 = 0;
          let count2 = 0;
          let count3 = 0;
          let count4 = 0;
          let count5 = 0;
          tdElements1.forEach((td) => {
            if (td.textContent.trim() !== "") {
              count1++;
            }
          });
          tdElements2.forEach((td) => {
            if (td.textContent.trim() !== "") {
              count2++;
            }
          });
          tdElements3.forEach((td) => {
            if (td.textContent.trim() !== "") {
              count3++;
            }
          });
          tdElements4.forEach((td) => {
            if (td.textContent.trim() !== "") {
              count4++;
            }
          });
          tdElements5.forEach((td) => {
            if (td.textContent.trim() !== "") {
              count5++;
            }
          });
          if (tdElements1) {
            update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + name), {
              total_time1: count1,
            });
          }
          if (tdElements2) {
            update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + name), {
              total_time2: count2,
            });
          }
          if (tdElements3) {
            update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + name), {
              total_time3: count3,
            });
          }
          if (tdElements4) {
            update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + name), {
              total_time4: count4,
            });
          }
          if (tdElements5) {
            update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + name), {
              total_time5: count5,
            });
          }


        }, 1000);
        if (t_type === 'english') {
          setTimeout(() => {
            const EntdElements1 = document.querySelectorAll(`.` + `${id}` + 'time1En');
            const EntdElements2 = document.querySelectorAll(`.` + `${id}` + 'time2En');
            const EntdElements3 = document.querySelectorAll(`.` + `${id}` + 'time3En');
            const EntdElements4 = document.querySelectorAll(`.` + `${id}` + 'time4En');
            const EntdElements5 = document.querySelectorAll(`.` + `${id}` + 'time5En');
            let Encount1 = 0;
            let Encount2 = 0;
            let Encount3 = 0;
            let Encount4 = 0;
            let Encount5 = 0;
            EntdElements1.forEach((td) => {
              if (td.textContent.trim() !== "") {
                Encount1++;
              }
            });
            EntdElements2.forEach((td) => {
              if (td.textContent.trim() !== "") {
                Encount2++;
              }
            });
            EntdElements3.forEach((td) => {
              if (td.textContent.trim() !== "") {
                Encount3++;
              }
            });
            EntdElements4.forEach((td) => {
              if (td.textContent.trim() !== "") {
                Encount4++;
              }
            });
            EntdElements5.forEach((td) => {
              if (td.textContent.trim() !== "") {
                Encount5++;
              }
            });
            if (EntdElements1) {
              update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + name), {
                total_time1: Encount1,
                teacher_type: t_type,
                permission: permission,
                t_grade: t_grade,
                nickname: nickname,
              });
            }
            if (EntdElements2) {
              update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + name), {
                total_time2: Encount2,
                teacher_type: t_type,
                permission: permission,
                t_grade: t_grade,
                nickname: nickname,

              });
            }
            if (EntdElements3) {
              update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + name), {
                total_time3: Encount3,
                teacher_type: t_type,
                permission: permission,
                t_grade: t_grade,
                nickname: nickname,

              });
            }
            if (EntdElements4) {
              update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + name), {
                total_time4: Encount4,
                teacher_type: t_type,
                permission: permission,
                t_grade: t_grade,
                nickname: nickname,

              });
            }
            if (EntdElements5) {
              update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + name), {
                total_time5: Encount5,
                teacher_type: t_type,
                permission: permission,
                t_grade: t_grade,
                nickname: nickname,

              });
            }


          }, 1000);
        }

      });
      const dataSet = data.val();
      // setdata(dataSet ? Object.values(dataSet) : []); // Convert object to array

    })

    if (selectTimeTable === 'បឋមសិក្សា') {
      setuserType('yes')
      onValue(mainDatabase, (data) => {
        const dataSet = data.val();
        setdata(dataSet ? Object.values(dataSet) : []); // Convert object to array
      })
    }
    if (selectTimeTable === 'អនុវិទ្យាល័យ') {
      setuserType('no')
      onValue(mainDbSecondary, (data) => {
        const dataSet = data.val();
        setdata(dataSet ? Object.values(dataSet) : []); // Convert object to array
      })
    }
    if (selectTimeTable === 'វិទ្យាល័យ') {
      setuserType('ok')
      onValue(mainDbHigh, (data) => {
        const dataSet = data.val();
        setdata(dataSet ? Object.values(dataSet) : []); // Convert object to array
      })
    }
    // const sortedData = [...dbPreview].sort((a, b) => a.nickname.localeCompare(b.nickname));
    // setdata(sortedData);
  }, [])
  useEffect(() => {
    const db = getDatabase();
    const dbSubjects = ref(db, `/SalaMOM/tools/subjects/`);
    const dbYear = ref(db, `/SalaMOM/tools/years/`);
    const dbPrimaryClass = ref(db, `/SalaMOM/tools/class/បឋមសិក្សា`);
    const dbSecondaryClass = ref(db, `/SalaMOM/tools/class/អនុវិទ្យាល័យ`);
    const dbHighClass = ref(db, `/SalaMOM/tools/class/វិទ្យាល័យ`);
    const dbStaff = ref(db, `SalaMOM/staffs`);

    onValue(dbSubjects, (data) => {
      const dataSet = data.val();
      setdataSubject(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    onValue(dbYear, (data) => {
      const dataSet = data.val();

      setdataYear(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    onValue(dbStaff, (data) => {
      const dataSet = data.val();
      setdataStaff(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })
    if (selectTimeTable == 'បឋមសិក្សា') {
      onValue(dbPrimaryClass, (data) => {
        const dataSet = data.val();
        data.forEach(e => {
          const id = e.val().clEn
          const g_kh = e.val().clKh
          const head_teacher = e.val().head_teacher
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/` + `${selectTimeTable}/` + id.replace(/\b0+/g, '')), {
            id: g_kh,
            clEn: id,
            head_teacher: head_teacher,

          });
        })
        setdataLevel(dataSet ? Object.values(dataSet) : []); // Convert object to array
      })
    }
    if (selectTimeTable == 'អនុវិទ្យាល័យ') {
      onValue(dbSecondaryClass, (data) => {
        const dataSet = data.val();
        data.forEach(e => {
          const id = e.val().clEn
          const g_kh = e.val().clKh
          const head_teacher = e.val().head_teacher
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/` + `${selectTimeTable}/` + id.replace(/\b0+/g, '')), {
            id: g_kh,
            clEn: id,
            head_teacher: head_teacher,

          });
        })
        setdataLevel(dataSet ? Object.values(dataSet) : []); // Convert object to array
      })
    }
    if (selectTimeTable == 'វិទ្យាល័យ') {
      onValue(dbHighClass, (data) => {
        const dataSet = data.val();
        data.forEach(e => {
          const id = e.val().clEn
          const g_kh = e.val().clKh
          const head_teacher = e.val().head_teacher
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/` + `${selectTimeTable}/` + id.replace(/\b0+/g, '')), {
            id: g_kh,
            clEn: id,
            head_teacher: head_teacher,

          });
        })
        setdataLevel(dataSet ? Object.values(dataSet) : []); // Convert object to array
      })
    }

    subInKh.current.value = myId
    BtnUpdate.current.style.display = 'none'
    const time1 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី១`);
    const time2 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី២`);
    const time3 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី៣`);
    const time4 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី៤`);
    const time5 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី៥`);
    const time6 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី៦`);
    const time7 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី៧`);
    const time8 = ref(db, `/SalaMOM/tools/times/ម៉ោងទី៨`);
    const break1 = ref(db, `/SalaMOM/tools/times/ម៉ោងចេញលេងទី១`);
    const break2 = ref(db, `/SalaMOM/tools/times/ម៉ោងចេញលេងទី២`);

    //Get Time for Time table
    onValue(time1, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        document.getElementById('t1_s').innerHTML = start;
        document.getElementById('t1_e').innerHTML = end;
        // document.querySelector('.merindiem1').innerHTML = meridiem;
        // document.querySelector('.merindiem2').innerHTML = meridiem;

      }, 1000);
    })
    onValue(time2, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        document.getElementById('t2_s').innerHTML = start;
        document.getElementById('t2_e').innerHTML = end;
        // document.querySelector('.merindiem3').innerHTML = meridiem;
        // document.querySelector('.merindiem4').innerHTML = meridiem;

      }, 1000);
    })
    onValue(time3, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        document.getElementById('t3_s').innerHTML = start;
        document.getElementById('t3_e').innerHTML = end;
        // document.querySelector('.merindiem7').innerHTML = meridiem;
        // document.querySelector('.merindiem8').innerHTML = meridiem;

      }, 1000);
    })
    onValue(time4, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        document.getElementById('t4_s').innerHTML = start;
        document.getElementById('t4_e').innerHTML = end;
        // document.querySelector('.merindiem9').innerHTML = meridiem;
        // document.querySelector('.merindiem10').innerHTML = meridiem;

      }, 1000);



    })
    onValue(time5, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        // document.querySelector('.merindiem11').innerHTML = meridiem;
        // document.querySelector('.merindiem12').innerHTML = meridiem;

        function convertTimeTo12HourFormat(time) {
          // Split the time string into hours and minutes
          const [hours, minutes] = time.split(':');
          const parsedHours = parseInt(hours);

          // Convert to 12-hour format and add AM/PM
          let newHours = parsedHours % 12;  // Get remainder for hours within 12-hour cycle
          if (newHours === 0) {
            newHours = 12;  // Handle 12:00 as 12 PM
          }
          const amPm = parsedHours >= 12 ? 'PM' : 'AM';

          return `${newHours.toString().padStart(2, '0')}:${minutes}`;
        }

        const originalTime = start;
        const originalTime2 = end;
        const convertedTime = convertTimeTo12HourFormat(originalTime);
        const convertedTime2 = convertTimeTo12HourFormat(originalTime2);

        document.getElementById('t5_s').innerHTML = convertedTime;
        document.getElementById('t5_e').innerHTML = convertedTime2;


      }, 1000);



    })
    onValue(time6, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        // document.querySelector('.merindiem13').innerHTML = meridiem;
        // document.querySelector('.merindiem14').innerHTML = meridiem;

        function convertTimeTo12HourFormat(time) {
          // Split the time string into hours and minutes
          const [hours, minutes] = time.split(':');
          const parsedHours = parseInt(hours);

          // Convert to 12-hour format and add AM/PM
          let newHours = parsedHours % 12;  // Get remainder for hours within 12-hour cycle
          if (newHours === 0) {
            newHours = 12;  // Handle 12:00 as 12 PM
          }
          const amPm = parsedHours >= 12 ? 'PM' : 'AM';

          return `${newHours.toString().padStart(2, '0')}:${minutes}`;
        }

        const originalTime = start;
        const originalTime2 = end;
        const convertedTime = convertTimeTo12HourFormat(originalTime);
        const convertedTime2 = convertTimeTo12HourFormat(originalTime2);

        document.getElementById('t6_s').innerHTML = convertedTime;
        document.getElementById('t6_e').innerHTML = convertedTime2;

      }, 1000);



    })
    onValue(time7, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        // document.querySelector('.merindiem17').innerHTML = meridiem;
        // document.querySelector('.merindiem18').innerHTML = meridiem;

        function convertTimeTo12HourFormat(time) {
          // Split the time string into hours and minutes
          const [hours, minutes] = time.split(':');
          const parsedHours = parseInt(hours);

          // Convert to 12-hour format and add AM/PM
          let newHours = parsedHours % 12;  // Get remainder for hours within 12-hour cycle
          if (newHours === 0) {
            newHours = 12;  // Handle 12:00 as 12 PM
          }
          const amPm = parsedHours >= 12 ? 'PM' : 'AM';

          return `${newHours.toString().padStart(2, '0')}:${minutes}`;
        }

        const originalTime = start;
        const originalTime2 = end;
        const convertedTime = convertTimeTo12HourFormat(originalTime);
        const convertedTime2 = convertTimeTo12HourFormat(originalTime2);

        document.getElementById('t7_s').innerHTML = convertedTime;
        document.getElementById('t7_e').innerHTML = convertedTime2;

      }, 1000);



    })
    onValue(time8, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      setTimeout(() => {
        // document.querySelector('.merindiem19').innerHTML = meridiem;
        // document.querySelector('.merindiem20').innerHTML = meridiem;

        function convertTimeTo12HourFormat(time) {
          // Split the time string into hours and minutes
          const [hours, minutes] = time.split(':');
          const parsedHours = parseInt(hours);

          // Convert to 12-hour format and add AM/PM
          let newHours = parsedHours % 12;  // Get remainder for hours within 12-hour cycle
          if (newHours === 0) {
            newHours = 12;  // Handle 12:00 as 12 PM
          }
          const amPm = parsedHours >= 12 ? 'PM' : 'AM';

          return `${newHours.toString().padStart(2, '0')}:${minutes}`;
        }

        const originalTime = start;
        const originalTime2 = end;
        const convertedTime = convertTimeTo12HourFormat(originalTime);
        const convertedTime2 = convertTimeTo12HourFormat(originalTime2);

        document.getElementById('t8_s').innerHTML = convertedTime;
        document.getElementById('t8_e').innerHTML = convertedTime2;


      }, 1000);


    })
    onValue(break1, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      var kind = data.val().time_setting_kind;
      setTimeout(() => {
        document.getElementById('b1_s').innerHTML = start;
        document.getElementById('b1_e').innerHTML = end;
        // document.querySelector('.merindiem5').innerHTML = meridiem;
        // document.querySelector('.merindiem6').innerHTML = meridiem;
        function getMinutesFromTimeRange(startTime, endTime) {
          // Split the time strings into hours and minutes
          const [startHours, startMinutes] = startTime.split(':');
          const [endHours, endMinutes] = endTime.split(':');

          // Convert hours to minutes
          const startMinutesTotal = parseInt(startHours) * 60 + parseInt(startMinutes);
          const endMinutesTotal = parseInt(endHours) * 60 + parseInt(endMinutes);

          // Calculate the total minutes
          const totalMinutes = endMinutesTotal - startMinutesTotal;

          return totalMinutes;
        }

        const startTime = start;
        const endTime = end;

        const minutes = getMinutesFromTimeRange(startTime, endTime);
        document.getElementById('k1').innerHTML = kind;
        document.getElementById('minu1').innerHTML = minutes;

      }, 1000);



    })
    onValue(break2, (data) => {
      var start = data.val().time_setting_start_at;
      var end = data.val().time_setting_end_at;
      var meridiem = data.val().time_setting_meridiem;
      var kind = data.val().time_setting_kind;
      setTimeout(() => {
        function convertTimeTo12HourFormat(time) {
          // Split the time string into hours and minutes
          const [hours, minutes] = time.split(':');
          const parsedHours = parseInt(hours);

          // Convert to 12-hour format and add AM/PM
          let newHours = parsedHours % 12;  // Get remainder for hours within 12-hour cycle
          if (newHours === 0) {
            newHours = 12;  // Handle 12:00 as 12 PM
          }
          const amPm = parsedHours >= 12 ? 'PM' : 'AM';

          return `${newHours.toString().padStart(2, '0')}:${minutes}`;
        }

        const originalTime = start;
        const originalTime2 = end;
        const convertedTime = convertTimeTo12HourFormat(originalTime);
        const convertedTime2 = convertTimeTo12HourFormat(originalTime2);

        document.getElementById('b2_s').innerHTML = convertedTime;
        document.getElementById('b2_e').innerHTML = convertedTime2;
        // document.querySelector('.merindiem15').innerHTML = meridiem;
        // document.querySelector('.merindiem16').innerHTML = meridiem;
        function getMinutesFromTimeRange(startTime, endTime) {
          // Split the time strings into hours and minutes
          const [startHours, startMinutes] = startTime.split(':');
          const [endHours, endMinutes] = endTime.split(':');

          // Convert hours to minutes
          const startMinutesTotal = parseInt(startHours) * 60 + parseInt(startMinutes);
          const endMinutesTotal = parseInt(endHours) * 60 + parseInt(endMinutes);

          // Calculate the total minutes
          const totalMinutes = endMinutesTotal - startMinutesTotal;

          return totalMinutes;
        }

        const startTime = start;
        const endTime = end;

        const minutes = getMinutesFromTimeRange(startTime, endTime);
        document.getElementById('k2').innerHTML = kind;
        document.getElementById('minu2').innerHTML = minutes;

      }, 1000);



    })

  }, [])

  function handleImageError(event) {
    // Replace with a placeholder image
    event.target.src = 'https://res.cloudinary.com/salamomschool/image/upload/v1713680567/user_icon.jpg'
  }
  const SetPicture = (d) => {
    if (d.get_url_pic) {
      return (< img className="me-3" style={{ width: "50px" }
      } src={d.get_url_pic} alt="image" />
      )
    } else {

      return (< img className="me-3" style={{ width: "50px" }
      } src="https://res.cloudinary.com/salamomschool/image/upload/v1709357129/fab63d7f9d9dd9de94019d884eac4a25.png" alt="image" />
      )
    }
  }
  const PutTitle = () => {
    if (selectTimeTable === 'បឋមសិក្សា') {
      setTitle('Primary Teacher')
      setgradeTitle('Grade 1- Grade 6')
    }
    if (selectTimeTable === 'អនុវិទ្យាល័យ') {
      setTitle('Secondary School Teacher')
      setgradeTitle('Grade 7 - Grade 9')
    }
    if (selectTimeTable === 'វិទ្យាល័យ') {
      setTitle('High School Teacher')
      setgradeTitle('Grade 10 - Grade 12')
    }
    if (selectTimeTable === 'បឋមសិក្សា') {
      setTitleEn('English Schedule')
      setgradeTitleEn('English (K2 - G12)')
    }
    if (selectTimeTable === 'អនុវិទ្យាល័យ') {
      setTitleEn('English Schedule')
      setgradeTitleEn('English (K2 - G12)')
    }
    if (selectTimeTable === 'វិទ្យាល័យ') {
      setTitleEn('English Schedule')
      setgradeTitleEn('English (K2 - G12)')
    }

  }

  // Pickup the date
  const [pickupDate, setPickupDate] = useState(localStorage.getItem('setIssue') || 'default');
  useEffect(() => {
    localStorage.setItem('setIssue', pickupDate)
    setPickupDate(localStorage.getItem('setIssue') || 'default')
  }, [pickupDate])

  function PickupDateInput() {
    setTimeout(() => {
      //Input Date
      var letDate = document.getElementById('pickupDate');
      var printDate = '';
      var getMonth = '';
      letDate.addEventListener('input', () => {
        var getDa = new Date(letDate.value);
        var gMonth = getDa.getMonth();
        var gDate = getDa.getDate();
        var gYear = getDa.getFullYear();
        if (gMonth == 0) { getMonth = '01' };
        if (gMonth == 1) { getMonth = '02' };
        if (gMonth == 2) { getMonth = '03' };
        if (gMonth == 3) { getMonth = '04' };
        if (gMonth == 4) { getMonth = '05' };
        if (gMonth == 5) { getMonth = '06' };
        if (gMonth == 6) { getMonth = '07' };
        if (gMonth == 7) { getMonth = '08' };
        if (gMonth == 8) { getMonth = '09' };
        if (gMonth == 9) { getMonth = '10' };
        if (gMonth == 10) { getMonth = '11' };
        if (gMonth == 11) { getMonth = '12' };

        printDate = `${gDate}/${getMonth}/${gYear}`;
        localStorage.setItem('setIssue', printDate);
        setPickupDate(localStorage.getItem('setIssue'))
      })

    }, 1000);

    return (
      <div>
        <label htmlFor="pickupDate">Issue Date:&nbsp;</label>
        <input
          type="date"
          id="pickupDate"
          style={{
            width: '1.5rem'
          }}
        />
        <p>{pickupDate}</p>
      </div>
    );
  }
  const PreviewBtn = () => {
    return (
      <>
        <div>
          <button type="button" className="btn btn-success btn-sm text-center me-3 dropdown-toggle"
            data-bs-toggle="dropdown" aria-expanded="false"
            style={{
              color: "white",
              lineHeight: "1",
              height: '2.2rem'

            }}
          >
            <ion-icon name="print-outline"></ion-icon> កាលវិភាគរួម
          </button>
          <ul className="dropdown-menu text-center">
            <li data-bs-toggle="modal" data-bs-target="#forPreviewPrimary"><a
              // onClick={PutTitle}
              className="dropdown-item">ថ្នាក់ទូទៅ</a></li>
            <li data-bs-toggle="modal" data-bs-target="#forPreviewEnglish"><a
              className="dropdown-item">ភាសាអង់គ្លេស</a></li>
          </ul>
        </div>

      </>
    )
  }
  const ControlBtn = () => {
    return (
      <>
        <div>
          <button type="button" className="btn btn-warning btn-sm text-center me-3 dropdown-toggle"
            data-bs-toggle="dropdown" aria-expanded="false"
            style={{
              color: "black",
              lineHeight: "1",
              height: '2.2rem',
              fontWeight: 'bold'

            }}
          >
            <ion-icon name="print-outline"></ion-icon> គ្រប់គ្រងឈ្មោះ
          </button>
          <ul className="dropdown-menu text-center">
            <li data-bs-toggle="modal" data-bs-target="#forControlUsers"><a
              className="dropdown-item">ថ្នាក់ទូទៅ</a></li>
            <li data-bs-toggle="modal" data-bs-target="#forControlEnglish"><a
              className="dropdown-item">ភាសាអង់គ្លេស</a></li>
          </ul>
        </div>

      </>
    )
  }
  const ControlUsers = () => {

    const deleteData = (e) => {
      const id = e.currentTarget.dataset.id
      if (id) {
        Swal.fire({
          title: "តើអ្នកប្រាកដឬ?",
          showCancelButton: true,
          confirmButtonText: "លុប",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              text: "ព័ត៍មានបានលុបត្រឹមត្រូវ!",
              icon: "success",
              showConfirmButton: false,
              timer: 2200,
            });
            remove(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id));
          }
        });
      }
    }



    return (
      <>
        <div className="modal fade" id="forControlUsers" tabindex="-1" aria-labelledby="forPreviewPrimary" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-body">
                <div class="content" id="time_tables">
                  <div class="container-fluid">
                    <div class="row">
                      <h4 class="card-title text-center">គ្រប់គ្រងឈ្មោះកម្រិត <span style={{ color: 'darkblue' }}>{selectTimeTable}</span>
                      </h4>
                      <div class="col-lg-12">
                        <div style={{ overflow: 'auto' }} id="show_mouse">
                          <table className="table table-bordered" id="myTable" ref={tableRef}>
                            <thead>
                              <tr>
                                <th>ល.រ</th>
                                <th>ឈ្មោះគ្រូ</th>
                                <th>ឈ្មោះអក្សរកាត់</th>
                                <th>លុប</th>
                              </tr>
                            </thead>
                            <tbody id="add_row">
                              {data.map((d, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{d.id}</td>
                                  <td>{d.nickname}</td>
                                  <td
                                    onClick={deleteData}
                                    data-id={d.id}
                                  ><CIcon style={{ color: 'red' }} icon={cilTrash} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">Printing</button>
              </div>
            </div>
          </div>
        </div>


      </>
    )
  }
  const ControlUsersEn = () => {

    const deleteData = (e) => {
      const id = e.currentTarget.dataset.id
      if (id) {
        Swal.fire({
          title: "តើអ្នកប្រាកដឬ?",
          showCancelButton: true,
          confirmButtonText: "លុប",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              text: "ព័ត៍មានបានលុបត្រឹមត្រូវ!",
              icon: "success",
              showConfirmButton: false,
              timer: 2200,
            });
            remove(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id));
          }
        });
      }
    }



    return (
      <>
        <div className="modal fade" id="forControlEnglish" tabindex="-1" aria-labelledby="forPreviewPrimary" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-body">
                <div class="content" id="time_tables">
                  <div class="container-fluid">
                    <div class="row">
                      <h4 class="card-title text-center">គ្រប់គ្រងឈ្មោះកម្រិត <span style={{ color: 'darkblue' }}>ភាសាអង់គ្លេស</span>
                      </h4>
                      <div class="col-lg-12">
                        <div style={{ overflow: 'auto' }} id="show_mouse">
                          <table className="table table-bordered" id="myTable" ref={tableRef}>
                            <thead>
                              <tr>
                                <th>ល.រ</th>
                                <th>ឈ្មោះគ្រូ</th>
                                <th>ឈ្មោះអក្សរកាត់</th>
                                <th>លុប</th>
                              </tr>
                            </thead>
                            <tbody id="add_row">
                              {dataEn.map((d, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{d.id}</td>
                                  <td>{d.nickname}</td>
                                  <td
                                    onClick={deleteData}
                                    data-id={d.id}
                                  ><CIcon style={{ color: 'red' }} icon={cilTrash} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">

                <button type="button" className="btn btn-primary">Printing</button>
              </div>
            </div>
          </div>
        </div>


      </>
    )
  }

  const PreviewPrimary = () => {
    const dbPreview = [...data].sort((a, b) => a.t_grade.localeCompare(b.t_grade));
    const dbAll = [...mainData].sort((a, b) => a.clEn.localeCompare(b.clEn));

    const ShowName = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <th style={{ backgroundColor: "#8cafff" }}>{"T." + d.nickname}</th>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ backgroundColor: "#8cafff" }}>{"T." + d.nickname}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ backgroundColor: "#8cafff" }}>{"T." + d.nickname}</th>
                }
              }
            }
          })}
          {dbAll.map((d, index) => {
            return <th style={{ backgroundColor: "#8cafff" }}>{"G" + d.clEn.replace(/\b0+/g, '')}</th>

          })}

        </>
      )
    }

    const TotalTime = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              const total =
                parseFloat(d.total_time1) +
                parseFloat(d.total_time2) +
                parseFloat(d.total_time3) +
                parseFloat(d.total_time4) +
                parseFloat(d.total_time5)
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <th style={{ color: 'red', fontWeight: 'bold', backgroundColor: '#defcf4' }}>{total}</th>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'red', fontWeight: 'bold', backgroundColor: '#defcf4' }}>{total}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'red', fontWeight: 'bold', backgroundColor: '#defcf4' }}>{total}</th>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <th style={{ color: 'red', fontWeight: 'bold', backgroundColor: '#defcf4' }}></th>
            })
          }

        </>
      )
    }
    const Count1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time1}</th>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time1}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time1}</th>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#defcf4' }}></th>
            })
          }
        </>
      )
    }
    const Count2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time2}</th>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time2}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time2}</th>
                }
              }
            }
          }
          )}
          {
            dbAll.map((d, index) => {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#defcf4' }}></th>
            })
          }
        </>
      )
    }
    const Count3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time3}</th>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time3}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time3}</th>
                }
              }
            }
          }
          )}
          {
            dbAll.map((d, index) => {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#defcf4' }}></th>
            })
          }
        </>
      )
    }
    const Count4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time4}</th>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time4}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time4}</th>
                }
              }
            }
          }
          )}
          {
            dbAll.map((d, index) => {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#defcf4' }}></th>
            })
          }
        </>
      )
    }
    const Count5 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time5}</th>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time5}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time5}</th>
                }
              }
            }
          }
          )}
          {
            dbAll.map((d, index) => {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#defcf4' }}></th>
            })
          }
        </>
      )
    }
    const Mon_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t1 === 'E' ? 'red' :
                          d.sub_mon_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t1 === 'Di' ? 'red' :
                              d.sub_mon_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t1 ? d.sub_mon_mor_t1 : ''}{d.grade_mon_mor_t1 ? d.grade_mon_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {

                  return <td
                    style={{
                      color: d.sub_mon_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t1 === 'E' ? 'red' :
                          d.sub_mon_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t1 === 'Di' ? 'red' :
                              d.sub_mon_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t1 ? d.sub_mon_mor_t1 : ''}{d.grade_mon_mor_t1 ? d.grade_mon_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {

                  return <td
                    style={{
                      color: d.sub_mon_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t1 === 'E' ? 'red' :
                          d.sub_mon_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t1 === 'Di' ? 'red' :
                              d.sub_mon_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t1 ? d.sub_mon_mor_t1 : ''}{d.grade_mon_mor_t1 ? d.grade_mon_mor_t1 : ''}</td>
                }
              }
            }
          }
          )}
          {dbAll.map((d, index) => {
            return <td
              style={{
                color: d.sub_mon_mor_t1 === 'PE' ? 'darkgreen' :
                  d.sub_mon_mor_t1 === 'E' ? 'red' :
                    d.sub_mon_mor_t1 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t1 === 'Di' ? 'red' :
                        d.sub_mon_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
              }}
              className={d.nickname + 'time1All'}>{d.sub_mon_mor_t1 ? d.sub_mon_mor_t1 : ''}{d.grade_mon_mor_t1 ? d.grade_mon_mor_t1 : ''}</td>
          })}

        </>
      )
    }
    const Mon_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t2 === 'E' ? 'red' :
                          d.sub_mon_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t2 === 'Di' ? 'red' :
                              d.sub_mon_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t2 ? d.sub_mon_mor_t2 : ''}{d.grade_mon_mor_t2 ? d.grade_mon_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t2 === 'E' ? 'red' :
                          d.sub_mon_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t2 === 'Di' ? 'red' :
                              d.sub_mon_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t2 ? d.sub_mon_mor_t2 : ''}{d.grade_mon_mor_t2 ? d.grade_mon_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t2 === 'E' ? 'red' :
                          d.sub_mon_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t2 === 'Di' ? 'red' :
                              d.sub_mon_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t2 ? d.sub_mon_mor_t2 : ''}{d.grade_mon_mor_t2 ? d.grade_mon_mor_t2 : ''}</td>
                }
              }
            }
          }
          )}
          {dbAll.map((d, index) => {
            return <td
              style={{
                color: d.sub_mon_mor_t2 === 'PE' ? 'darkgreen' :
                  d.sub_mon_mor_t2 === 'E' ? 'red' :
                    d.sub_mon_mor_t2 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t2 === 'Di' ? 'red' :
                        d.sub_mon_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
              }}
              className={d.nickname + 'time1All'}>{d.sub_mon_mor_t2 ? d.sub_mon_mor_t2 : ''}{d.grade_mon_mor_t2 ? d.grade_mon_mor_t2 : ''}</td>
          })}

        </>
      )
    }
    const Mon_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t3 === 'E' ? 'red' :
                          d.sub_mon_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t3 === 'Di' ? 'red' :
                              d.sub_mon_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t3 ? d.sub_mon_mor_t3 : ''}{d.grade_mon_mor_t3 ? d.grade_mon_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t3 === 'E' ? 'red' :
                          d.sub_mon_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t3 === 'Di' ? 'red' :
                              d.sub_mon_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t3 ? d.sub_mon_mor_t3 : ''}{d.grade_mon_mor_t3 ? d.grade_mon_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t3 === 'E' ? 'red' :
                          d.sub_mon_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t3 === 'Di' ? 'red' :
                              d.sub_mon_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t3 ? d.sub_mon_mor_t3 : ''}{d.grade_mon_mor_t3 ? d.grade_mon_mor_t3 : ''}</td>
                }
              }
            }
          })}
          {dbAll.map((d, index) => {
            return <td
              style={{
                color: d.sub_mon_mor_t3 === 'PE' ? 'darkgreen' :
                  d.sub_mon_mor_t3 === 'E' ? 'red' :
                    d.sub_mon_mor_t3 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t3 === 'Di' ? 'red' :
                        d.sub_mon_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
              }}
              className={d.nickname + 'time1All'}>{d.sub_mon_mor_t3 ? d.sub_mon_mor_t3 : ''}{d.grade_mon_mor_t3 ? d.grade_mon_mor_t3 : ''}</td>
          })}

        </>
      )
    }
    const Mon_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t4 === 'E' ? 'red' :
                          d.sub_mon_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t4 === 'Di' ? 'red' :
                              d.sub_mon_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t4 ? d.sub_mon_mor_t4 : ''}{d.grade_mon_mor_t4 ? d.grade_mon_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t4 === 'E' ? 'red' :
                          d.sub_mon_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t4 === 'Di' ? 'red' :
                              d.sub_mon_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t4 ? d.sub_mon_mor_t4 : ''}{d.grade_mon_mor_t4 ? d.grade_mon_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_mon_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_mon_mor_t4 === 'E' ? 'red' :
                          d.sub_mon_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_mon_mor_t4 === 'Di' ? 'red' :
                              d.sub_mon_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_mor_t4 ? d.sub_mon_mor_t4 : ''}{d.grade_mon_mor_t4 ? d.grade_mon_mor_t4 : ''}</td>
                }
              }
            }

          })}
          {dbAll.map((d, index) => {
            return <td
              style={{
                color: d.sub_mon_mor_t4 === 'PE' ? 'darkgreen' :
                  d.sub_mon_mor_t4 === 'E' ? 'red' :
                    d.sub_mon_mor_t4 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t4 === 'Di' ? 'red' :
                        d.sub_mon_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
              }}
              className={d.nickname + 'time1All'}>{d.sub_mon_mor_t4 ? d.sub_mon_mor_t4 : ''}{d.grade_mon_mor_t4 ? d.grade_mon_mor_t4 : ''}</td>
          })}

        </>
      )
    }
    const Mon_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t1 === 'E' ? 'red' :
                          d.sub_mon_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t1 === 'Di' ? 'red' :
                              d.sub_mon_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t1 ? d.sub_mon_aft_t1 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t1 === 'E' ? 'red' :
                          d.sub_mon_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t1 === 'Di' ? 'red' :
                              d.sub_mon_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t1 ? d.sub_mon_aft_t1 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t1 === 'E' ? 'red' :
                          d.sub_mon_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t1 === 'Di' ? 'red' :
                              d.sub_mon_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t1 ? d.sub_mon_aft_t1 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
                }
              }
            }

          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_mon_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t1 === 'E' ? 'red' :
                      d.sub_mon_aft_t1 === 'Bi' ? 'blue' :
                        d.sub_mon_aft_t1 === 'Di' ? 'red' :
                          d.sub_mon_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}

                className={d.nickname + 'time1All'}>{d.sub_mon_aft_t1 ? d.sub_mon_aft_t1 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Mon_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t2 === 'E' ? 'red' :
                          d.sub_mon_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t2 === 'Di' ? 'red' :
                              d.sub_mon_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t2 ? d.sub_mon_aft_t2 : ''}{d.grade_mon_aft_t2 ? d.grade_mon_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t2 === 'E' ? 'red' :
                          d.sub_mon_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t2 === 'Di' ? 'red' :
                              d.sub_mon_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t2 ? d.sub_mon_aft_t2 : ''}{d.grade_mon_aft_t2 ? d.grade_mon_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t2 === 'E' ? 'red' :
                          d.sub_mon_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t2 === 'Di' ? 'red' :
                              d.sub_mon_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t2 ? d.sub_mon_aft_t2 : ''}{d.grade_mon_aft_t2 ? d.grade_mon_aft_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_mon_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t2 === 'E' ? 'red' :
                      d.sub_mon_aft_t2 === 'Bi' ? 'blue' :
                        d.sub_mon_aft_t2 === 'Di' ? 'red' :
                          d.sub_mon_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}

                className={d.nickname + 'time1All'}>{d.sub_mon_aft_t2 ? d.sub_mon_aft_t2 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Mon_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t3 === 'E' ? 'red' :
                          d.sub_mon_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t3 === 'Di' ? 'red' :
                              d.sub_mon_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t3 ? d.sub_mon_aft_t3 : ''}{d.grade_mon_aft_t3 ? d.grade_mon_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t3 === 'E' ? 'red' :
                          d.sub_mon_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t3 === 'Di' ? 'red' :
                              d.sub_mon_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t3 ? d.sub_mon_aft_t3 : ''}{d.grade_mon_aft_t3 ? d.grade_mon_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t3 === 'E' ? 'red' :
                          d.sub_mon_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t3 === 'Di' ? 'red' :
                              d.sub_mon_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t3 ? d.sub_mon_aft_t3 : ''}{d.grade_mon_aft_t3 ? d.grade_mon_aft_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_mon_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t3 === 'E' ? 'red' :
                      d.sub_mon_aft_t3 === 'Bi' ? 'blue' :
                        d.sub_mon_aft_t3 === 'Di' ? 'red' :
                          d.sub_mon_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}

                className={d.nickname + 'time1All'}>{d.sub_mon_aft_t3 ? d.sub_mon_aft_t3 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Mon_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t4 === 'E' ? 'red' :
                          d.sub_mon_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t4 === 'Di' ? 'red' :
                              d.sub_mon_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t4 ? d.sub_mon_aft_t4 : ''}{d.grade_mon_aft_t4 ? d.grade_mon_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t4 === 'E' ? 'red' :
                          d.sub_mon_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t4 === 'Di' ? 'red' :
                              d.sub_mon_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}


                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t4 ? d.sub_mon_aft_t4 : ''}{d.grade_mon_aft_t4 ? d.grade_mon_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_mon_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_mon_aft_t4 === 'E' ? 'red' :
                          d.sub_mon_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_mon_aft_t4 === 'Di' ? 'red' :
                              d.sub_mon_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}

                    className={d.nickname + 'time1'}>{d.sub_mon_aft_t4 ? d.sub_mon_aft_t4 : ''}{d.grade_mon_aft_t4 ? d.grade_mon_aft_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_mon_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t4 === 'E' ? 'red' :
                      d.sub_mon_aft_t4 === 'Bi' ? 'blue' :
                        d.sub_mon_aft_t4 === 'Di' ? 'red' :
                          d.sub_mon_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}

                className={d.nickname + 'time1All'}>{d.sub_mon_aft_t4 ? d.sub_mon_aft_t4 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Tue_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t1 === 'E' ? 'red' :
                          d.sub_tue_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t1 === 'Di' ? 'red' :
                              d.sub_tue_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t1 ? d.sub_tue_mor_t1 : ''}{d.grade_tue_mor_t1 ? d.grade_tue_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t1 === 'E' ? 'red' :
                          d.sub_tue_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t1 === 'Di' ? 'red' :
                              d.sub_tue_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t1 ? d.sub_tue_mor_t1 : ''}{d.grade_tue_mor_t1 ? d.grade_tue_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t1 === 'E' ? 'red' :
                          d.sub_tue_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t1 === 'Di' ? 'red' :
                              d.sub_tue_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t1 ? d.sub_tue_mor_t1 : ''}{d.grade_tue_mor_t1 ? d.grade_tue_mor_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t1 === 'E' ? 'red' :
                      d.sub_tue_mor_t1 === 'Bi' ? 'blue' :
                        d.sub_tue_mor_t1 === 'Di' ? 'red' :
                          d.sub_tue_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_mor_t1 ? d.sub_tue_mor_t1 : ''}{d.grade_tue_mor_t1 ? d.grade_tue_mor_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Tue_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t2 === 'E' ? 'red' :
                          d.sub_tue_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t2 === 'Di' ? 'red' :
                              d.sub_tue_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t2 ? d.sub_tue_mor_t2 : ''}{d.grade_tue_mor_t2 ? d.grade_tue_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t2 === 'E' ? 'red' :
                          d.sub_tue_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t2 === 'Di' ? 'red' :
                              d.sub_tue_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t2 ? d.sub_tue_mor_t2 : ''}{d.grade_tue_mor_t2 ? d.grade_tue_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t2 === 'E' ? 'red' :
                          d.sub_tue_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t2 === 'Di' ? 'red' :
                              d.sub_tue_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t2 ? d.sub_tue_mor_t2 : ''}{d.grade_tue_mor_t2 ? d.grade_tue_mor_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t2 === 'E' ? 'red' :
                      d.sub_tue_mor_t2 === 'Bi' ? 'blue' :
                        d.sub_tue_mor_t2 === 'Di' ? 'red' :
                          d.sub_tue_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_mor_t2 ? d.sub_tue_mor_t2 : ''}{d.grade_tue_mor_t2 ? d.grade_tue_mor_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Tue_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t3 === 'E' ? 'red' :
                          d.sub_tue_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t3 === 'Di' ? 'red' :
                              d.sub_tue_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t3 ? d.sub_tue_mor_t3 : ''}{d.grade_tue_mor_t3 ? d.grade_tue_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t3 === 'E' ? 'red' :
                          d.sub_tue_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t3 === 'Di' ? 'red' :
                              d.sub_tue_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t3 ? d.sub_tue_mor_t3 : ''}{d.grade_tue_mor_t3 ? d.grade_tue_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t3 === 'E' ? 'red' :
                          d.sub_tue_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t3 === 'Di' ? 'red' :
                              d.sub_tue_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t3 ? d.sub_tue_mor_t3 : ''}{d.grade_tue_mor_t3 ? d.grade_tue_mor_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t3 === 'E' ? 'red' :
                      d.sub_tue_mor_t3 === 'Bi' ? 'blue' :
                        d.sub_tue_mor_t3 === 'Di' ? 'red' :
                          d.sub_tue_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_mor_t3 ? d.sub_tue_mor_t3 : ''}{d.grade_tue_mor_t3 ? d.grade_tue_mor_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Tue_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t4 === 'E' ? 'red' :
                          d.sub_tue_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t4 === 'Di' ? 'red' :
                              d.sub_tue_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t4 ? d.sub_tue_mor_t4 : ''}{d.grade_tue_mor_t4 ? d.grade_tue_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t4 === 'E' ? 'red' :
                          d.sub_tue_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t4 === 'Di' ? 'red' :
                              d.sub_tue_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t4 ? d.sub_tue_mor_t4 : ''}{d.grade_tue_mor_t4 ? d.grade_tue_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_tue_mor_t4 === 'E' ? 'red' :
                          d.sub_tue_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_tue_mor_t4 === 'Di' ? 'red' :
                              d.sub_tue_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_mor_t4 ? d.sub_tue_mor_t4 : ''}{d.grade_tue_mor_t4 ? d.grade_tue_mor_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t4 === 'E' ? 'red' :
                      d.sub_tue_mor_t4 === 'Bi' ? 'blue' :
                        d.sub_tue_mor_t4 === 'Di' ? 'red' :
                          d.sub_tue_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_mor_t4 ? d.sub_tue_mor_t4 : ''}{d.grade_tue_mor_t4 ? d.grade_tue_mor_t4 : ''}</td>
            })
          }
        </>
      )
    }

    const Tue_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t1 === 'E' ? 'red' :
                          d.sub_tue_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t1 === 'Di' ? 'red' :
                              d.sub_tue_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t1 ? d.sub_tue_aft_t1 : ''}{d.grade_tue_aft_t1 ? d.grade_tue_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t1 === 'E' ? 'red' :
                          d.sub_tue_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t1 === 'Di' ? 'red' :
                              d.sub_tue_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t1 ? d.sub_tue_aft_t1 : ''}{d.grade_tue_aft_t1 ? d.grade_tue_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t1 === 'E' ? 'red' :
                          d.sub_tue_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t1 === 'Di' ? 'red' :
                              d.sub_tue_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t1 ? d.sub_tue_aft_t1 : ''}{d.grade_tue_aft_t1 ? d.grade_tue_aft_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t1 === 'E' ? 'red' :
                      d.sub_tue_aft_t1 === 'Bi' ? 'blue' :
                        d.sub_tue_aft_t1 === 'Di' ? 'red' :
                          d.sub_tue_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_aft_t1 ? d.sub_tue_aft_t1 : ''}{d.grade_tue_aft_t1 ? d.grade_tue_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Tue_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t2 === 'E' ? 'red' :
                          d.sub_tue_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t2 === 'Di' ? 'red' :
                              d.sub_tue_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t2 ? d.sub_tue_aft_t2 : ''}{d.grade_tue_aft_t2 ? d.grade_tue_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t2 === 'E' ? 'red' :
                          d.sub_tue_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t2 === 'Di' ? 'red' :
                              d.sub_tue_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t2 ? d.sub_tue_aft_t2 : ''}{d.grade_tue_aft_t2 ? d.grade_tue_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t2 === 'E' ? 'red' :
                          d.sub_tue_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t2 === 'Di' ? 'red' :
                              d.sub_tue_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t2 ? d.sub_tue_aft_t2 : ''}{d.grade_tue_aft_t2 ? d.grade_tue_aft_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t2 === 'E' ? 'red' :
                      d.sub_tue_aft_t2 === 'Bi' ? 'blue' :
                        d.sub_tue_aft_t2 === 'Di' ? 'red' :
                          d.sub_tue_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_aft_t2 ? d.sub_tue_aft_t2 : ''}{d.grade_tue_aft_t2 ? d.grade_tue_aft_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Tue_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t3 === 'E' ? 'red' :
                          d.sub_tue_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t3 === 'Di' ? 'red' :
                              d.sub_tue_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t3 ? d.sub_tue_aft_t3 : ''}{d.grade_tue_aft_t3 ? d.grade_tue_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t3 === 'E' ? 'red' :
                          d.sub_tue_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t3 === 'Di' ? 'red' :
                              d.sub_tue_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t3 ? d.sub_tue_aft_t3 : ''}{d.grade_tue_aft_t3 ? d.grade_tue_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t3 === 'E' ? 'red' :
                          d.sub_tue_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t3 === 'Di' ? 'red' :
                              d.sub_tue_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t3 ? d.sub_tue_aft_t3 : ''}{d.grade_tue_aft_t3 ? d.grade_tue_aft_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t3 === 'E' ? 'red' :
                      d.sub_tue_aft_t3 === 'Bi' ? 'blue' :
                        d.sub_tue_aft_t3 === 'Di' ? 'red' :
                          d.sub_tue_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_aft_t3 ? d.sub_tue_aft_t3 : ''}{d.grade_tue_aft_t3 ? d.grade_tue_aft_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Tue_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t4 === 'E' ? 'red' :
                          d.sub_tue_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t4 === 'Di' ? 'red' :
                              d.sub_tue_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t4 ? d.sub_tue_aft_t4 : ''}{d.grade_tue_aft_t4 ? d.grade_tue_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t4 === 'E' ? 'red' :
                          d.sub_tue_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t4 === 'Di' ? 'red' :
                              d.sub_tue_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t4 ? d.sub_tue_aft_t4 : ''}{d.grade_tue_aft_t4 ? d.grade_tue_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_tue_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_tue_aft_t4 === 'E' ? 'red' :
                          d.sub_tue_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_tue_aft_t4 === 'Di' ? 'red' :
                              d.sub_tue_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time2'}>{d.sub_tue_aft_t4 ? d.sub_tue_aft_t4 : ''}{d.grade_tue_aft_t4 ? d.grade_tue_aft_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_tue_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t4 === 'E' ? 'red' :
                      d.sub_tue_aft_t4 === 'Bi' ? 'blue' :
                        d.sub_tue_aft_t4 === 'Di' ? 'red' :
                          d.sub_tue_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2All'}>{d.sub_tue_aft_t4 ? d.sub_tue_aft_t4 : ''}{d.grade_tue_aft_t4 ? d.grade_tue_aft_t4 : ''}</td>
            })
          }
        </>
      )
    }
    const Wed_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t1 === 'E' ? 'red' :
                          d.sub_wed_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t1 === 'Di' ? 'red' :
                              d.sub_wed_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t1 ? d.sub_wed_mor_t1 : ''}{d.grade_wed_mor_t1 ? d.grade_wed_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t1 === 'E' ? 'red' :
                          d.sub_wed_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t1 === 'Di' ? 'red' :
                              d.sub_wed_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t1 ? d.sub_wed_mor_t1 : ''}{d.grade_wed_mor_t1 ? d.grade_wed_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t1 === 'E' ? 'red' :
                          d.sub_wed_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t1 === 'Di' ? 'red' :
                              d.sub_wed_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t1 ? d.sub_wed_mor_t1 : ''}{d.grade_wed_mor_t1 ? d.grade_wed_mor_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t1 === 'E' ? 'red' :
                      d.sub_wed_mor_t1 === 'Bi' ? 'blue' :
                        d.sub_wed_mor_t1 === 'Di' ? 'red' :
                          d.sub_wed_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_mor_t1 ? d.sub_wed_mor_t1 : ''}{d.grade_wed_mor_t1 ? d.grade_wed_mor_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Wed_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t2 === 'E' ? 'red' :
                          d.sub_wed_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t2 === 'Di' ? 'red' :
                              d.sub_wed_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t2 ? d.sub_wed_mor_t2 : ''}{d.grade_wed_mor_t2 ? d.grade_wed_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t2 === 'E' ? 'red' :
                          d.sub_wed_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t2 === 'Di' ? 'red' :
                              d.sub_wed_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t2 ? d.sub_wed_mor_t2 : ''}{d.grade_wed_mor_t2 ? d.grade_wed_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t2 === 'E' ? 'red' :
                          d.sub_wed_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t2 === 'Di' ? 'red' :
                              d.sub_wed_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t2 ? d.sub_wed_mor_t2 : ''}{d.grade_wed_mor_t2 ? d.grade_wed_mor_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t2 === 'E' ? 'red' :
                      d.sub_wed_mor_t2 === 'Bi' ? 'blue' :
                        d.sub_wed_mor_t2 === 'Di' ? 'red' :
                          d.sub_wed_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_mor_t2 ? d.sub_wed_mor_t2 : ''}{d.grade_wed_mor_t2 ? d.grade_wed_mor_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Wed_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t3 === 'E' ? 'red' :
                          d.sub_wed_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t3 === 'Di' ? 'red' :
                              d.sub_wed_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t3 ? d.sub_wed_mor_t3 : ''}{d.grade_wed_mor_t3 ? d.grade_wed_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t3 === 'E' ? 'red' :
                          d.sub_wed_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t3 === 'Di' ? 'red' :
                              d.sub_wed_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t3 ? d.sub_wed_mor_t3 : ''}{d.grade_wed_mor_t3 ? d.grade_wed_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t3 === 'E' ? 'red' :
                          d.sub_wed_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t3 === 'Di' ? 'red' :
                              d.sub_wed_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t3 ? d.sub_wed_mor_t3 : ''}{d.grade_wed_mor_t3 ? d.grade_wed_mor_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t3 === 'E' ? 'red' :
                      d.sub_wed_mor_t3 === 'Bi' ? 'blue' :
                        d.sub_wed_mor_t3 === 'Di' ? 'red' :
                          d.sub_wed_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_mor_t3 ? d.sub_wed_mor_t3 : ''}{d.grade_wed_mor_t3 ? d.grade_wed_mor_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Wed_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t4 === 'E' ? 'red' :
                          d.sub_wed_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t4 === 'Di' ? 'red' :
                              d.sub_wed_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t4 ? d.sub_wed_mor_t4 : ''}{d.grade_wed_mor_t4 ? d.grade_wed_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t4 === 'E' ? 'red' :
                          d.sub_wed_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t4 === 'Di' ? 'red' :
                              d.sub_wed_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t4 ? d.sub_wed_mor_t4 : ''}{d.grade_wed_mor_t4 ? d.grade_wed_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_wed_mor_t4 === 'E' ? 'red' :
                          d.sub_wed_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_wed_mor_t4 === 'Di' ? 'red' :
                              d.sub_wed_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_mor_t4 ? d.sub_wed_mor_t4 : ''}{d.grade_wed_mor_t4 ? d.grade_wed_mor_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t4 === 'E' ? 'red' :
                      d.sub_wed_mor_t4 === 'Bi' ? 'blue' :
                        d.sub_wed_mor_t4 === 'Di' ? 'red' :
                          d.sub_wed_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_mor_t4 ? d.sub_wed_mor_t4 : ''}{d.grade_wed_mor_t4 ? d.grade_wed_mor_t4 : ''}</td>
            })
          }
        </>
      )
    }

    const Wed_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t1 === 'E' ? 'red' :
                          d.sub_wed_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t1 === 'Di' ? 'red' :
                              d.sub_wed_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t1 ? d.sub_wed_aft_t1 : ''}{d.grade_wed_aft_t1 ? d.grade_wed_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t1 === 'E' ? 'red' :
                          d.sub_wed_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t1 === 'Di' ? 'red' :
                              d.sub_wed_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t1 ? d.sub_wed_aft_t1 : ''}{d.grade_wed_aft_t1 ? d.grade_wed_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t1 === 'E' ? 'red' :
                          d.sub_wed_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t1 === 'Di' ? 'red' :
                              d.sub_wed_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t1 ? d.sub_wed_aft_t1 : ''}{d.grade_wed_aft_t1 ? d.grade_wed_aft_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t1 === 'E' ? 'red' :
                      d.sub_wed_aft_t1 === 'Bi' ? 'blue' :
                        d.sub_wed_aft_t1 === 'Di' ? 'red' :
                          d.sub_wed_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_aft_t1 ? d.sub_wed_aft_t1 : ''}{d.grade_wed_aft_t1 ? d.grade_wed_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Wed_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t2 === 'E' ? 'red' :
                          d.sub_wed_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t2 === 'Di' ? 'red' :
                              d.sub_wed_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t2 ? d.sub_wed_aft_t2 : ''}{d.grade_wed_aft_t2 ? d.grade_wed_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t2 === 'E' ? 'red' :
                          d.sub_wed_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t2 === 'Di' ? 'red' :
                              d.sub_wed_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t2 ? d.sub_wed_aft_t2 : ''}{d.grade_wed_aft_t2 ? d.grade_wed_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t2 === 'E' ? 'red' :
                          d.sub_wed_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t2 === 'Di' ? 'red' :
                              d.sub_wed_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t2 ? d.sub_wed_aft_t2 : ''}{d.grade_wed_aft_t2 ? d.grade_wed_aft_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t2 === 'E' ? 'red' :
                      d.sub_wed_aft_t2 === 'Bi' ? 'blue' :
                        d.sub_wed_aft_t2 === 'Di' ? 'red' :
                          d.sub_wed_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_aft_t2 ? d.sub_wed_aft_t2 : ''}{d.grade_wed_aft_t2 ? d.grade_wed_aft_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Wed_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t3 === 'E' ? 'red' :
                          d.sub_wed_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t3 === 'Di' ? 'red' :
                              d.sub_wed_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t3 ? d.sub_wed_aft_t3 : ''}{d.grade_wed_aft_t3 ? d.grade_wed_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t3 === 'E' ? 'red' :
                          d.sub_wed_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t3 === 'Di' ? 'red' :
                              d.sub_wed_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t3 ? d.sub_wed_aft_t3 : ''}{d.grade_wed_aft_t3 ? d.grade_wed_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t3 === 'E' ? 'red' :
                          d.sub_wed_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t3 === 'Di' ? 'red' :
                              d.sub_wed_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t3 ? d.sub_wed_aft_t3 : ''}{d.grade_wed_aft_t3 ? d.grade_wed_aft_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t3 === 'E' ? 'red' :
                      d.sub_wed_aft_t3 === 'Bi' ? 'blue' :
                        d.sub_wed_aft_t3 === 'Di' ? 'red' :
                          d.sub_wed_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_aft_t3 ? d.sub_wed_aft_t3 : ''}{d.grade_wed_aft_t3 ? d.grade_wed_aft_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Wed_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t4 === 'E' ? 'red' :
                          d.sub_wed_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t4 === 'Di' ? 'red' :
                              d.sub_wed_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t4 ? d.sub_wed_aft_t4 : ''}{d.grade_wed_aft_t4 ? d.grade_wed_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t4 === 'E' ? 'red' :
                          d.sub_wed_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t4 === 'Di' ? 'red' :
                              d.sub_wed_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t4 ? d.sub_wed_aft_t4 : ''}{d.grade_wed_aft_t4 ? d.grade_wed_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_wed_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_wed_aft_t4 === 'E' ? 'red' :
                          d.sub_wed_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_wed_aft_t4 === 'Di' ? 'red' :
                              d.sub_wed_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time3'}>{d.sub_wed_aft_t4 ? d.sub_wed_aft_t4 : ''}{d.grade_wed_aft_t4 ? d.grade_wed_aft_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_wed_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t4 === 'E' ? 'red' :
                      d.sub_wed_aft_t4 === 'Bi' ? 'blue' :
                        d.sub_wed_aft_t4 === 'Di' ? 'red' :
                          d.sub_wed_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3All'}>{d.sub_wed_aft_t4 ? d.sub_wed_aft_t4 : ''}{d.grade_wed_aft_t4 ? d.grade_wed_aft_t4 : ''}</td>
            })
          }
        </>
      )
    }
    const Thu_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t1 === 'E' ? 'red' :
                          d.sub_thu_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t1 === 'Di' ? 'red' :
                              d.sub_thu_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t1 ? d.sub_thu_mor_t1 : ''}{d.grade_thu_mor_t1 ? d.grade_thu_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t1 === 'E' ? 'red' :
                          d.sub_thu_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t1 === 'Di' ? 'red' :
                              d.sub_thu_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t1 ? d.sub_thu_mor_t1 : ''}{d.grade_thu_mor_t1 ? d.grade_thu_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t1 === 'E' ? 'red' :
                          d.sub_thu_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t1 === 'Di' ? 'red' :
                              d.sub_thu_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t1 ? d.sub_thu_mor_t1 : ''}{d.grade_thu_mor_t1 ? d.grade_thu_mor_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t1 === 'E' ? 'red' :
                      d.sub_thu_mor_t1 === 'Bi' ? 'blue' :
                        d.sub_thu_mor_t1 === 'Di' ? 'red' :
                          d.sub_thu_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_mor_t1 ? d.sub_thu_mor_t1 : ''}{d.grade_thu_mor_t1 ? d.grade_thu_mor_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Thu_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t2 === 'E' ? 'red' :
                          d.sub_thu_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t2 === 'Di' ? 'red' :
                              d.sub_thu_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t2 ? d.sub_thu_mor_t2 : ''}{d.grade_thu_mor_t2 ? d.grade_thu_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t2 === 'E' ? 'red' :
                          d.sub_thu_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t2 === 'Di' ? 'red' :
                              d.sub_thu_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t2 ? d.sub_thu_mor_t2 : ''}{d.grade_thu_mor_t2 ? d.grade_thu_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t2 === 'E' ? 'red' :
                          d.sub_thu_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t2 === 'Di' ? 'red' :
                              d.sub_thu_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t2 ? d.sub_thu_mor_t2 : ''}{d.grade_thu_mor_t2 ? d.grade_thu_mor_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t2 === 'E' ? 'red' :
                      d.sub_thu_mor_t2 === 'Bi' ? 'blue' :
                        d.sub_thu_mor_t2 === 'Di' ? 'red' :
                          d.sub_thu_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_mor_t2 ? d.sub_thu_mor_t2 : ''}{d.grade_thu_mor_t2 ? d.grade_thu_mor_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Thu_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t3 === 'E' ? 'red' :
                          d.sub_thu_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t3 === 'Di' ? 'red' :
                              d.sub_thu_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t3 ? d.sub_thu_mor_t3 : ''}{d.grade_thu_mor_t3 ? d.grade_thu_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t3 === 'E' ? 'red' :
                          d.sub_thu_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t3 === 'Di' ? 'red' :
                              d.sub_thu_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t3 ? d.sub_thu_mor_t3 : ''}{d.grade_thu_mor_t3 ? d.grade_thu_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t3 === 'E' ? 'red' :
                          d.sub_thu_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t3 === 'Di' ? 'red' :
                              d.sub_thu_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t3 ? d.sub_thu_mor_t3 : ''}{d.grade_thu_mor_t3 ? d.grade_thu_mor_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t3 === 'E' ? 'red' :
                      d.sub_thu_mor_t3 === 'Bi' ? 'blue' :
                        d.sub_thu_mor_t3 === 'Di' ? 'red' :
                          d.sub_thu_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_mor_t3 ? d.sub_thu_mor_t3 : ''}{d.grade_thu_mor_t3 ? d.grade_thu_mor_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Thu_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t4 === 'E' ? 'red' :
                          d.sub_thu_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t4 === 'Di' ? 'red' :
                              d.sub_thu_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t4 ? d.sub_thu_mor_t4 : ''}{d.grade_thu_mor_t4 ? d.grade_thu_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t4 === 'E' ? 'red' :
                          d.sub_thu_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t4 === 'Di' ? 'red' :
                              d.sub_thu_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t4 ? d.sub_thu_mor_t4 : ''}{d.grade_thu_mor_t4 ? d.grade_thu_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_thu_mor_t4 === 'E' ? 'red' :
                          d.sub_thu_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_thu_mor_t4 === 'Di' ? 'red' :
                              d.sub_thu_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_mor_t4 ? d.sub_thu_mor_t4 : ''}{d.grade_thu_mor_t4 ? d.grade_thu_mor_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t4 === 'E' ? 'red' :
                      d.sub_thu_mor_t4 === 'Bi' ? 'blue' :
                        d.sub_thu_mor_t4 === 'Di' ? 'red' :
                          d.sub_thu_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_mor_t4 ? d.sub_thu_mor_t4 : ''}{d.grade_thu_mor_t4 ? d.grade_thu_mor_t4 : ''}</td>
            })
          }
        </>
      )
    }

    const Thu_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t1 === 'E' ? 'red' :
                          d.sub_thu_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t1 === 'Di' ? 'red' :
                              d.sub_thu_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t1 ? d.sub_thu_aft_t1 : ''}{d.grade_thu_aft_t1 ? d.grade_thu_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t1 === 'E' ? 'red' :
                          d.sub_thu_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t1 === 'Di' ? 'red' :
                              d.sub_thu_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t1 ? d.sub_thu_aft_t1 : ''}{d.grade_thu_aft_t1 ? d.grade_thu_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t1 === 'E' ? 'red' :
                          d.sub_thu_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t1 === 'Di' ? 'red' :
                              d.sub_thu_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t1 ? d.sub_thu_aft_t1 : ''}{d.grade_thu_aft_t1 ? d.grade_thu_aft_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t1 === 'E' ? 'red' :
                      d.sub_thu_aft_t1 === 'Bi' ? 'blue' :
                        d.sub_thu_aft_t1 === 'Di' ? 'red' :
                          d.sub_thu_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_aft_t1 ? d.sub_thu_aft_t1 : ''}{d.grade_thu_aft_t1 ? d.grade_thu_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Thu_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t2 === 'E' ? 'red' :
                          d.sub_thu_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t2 === 'Di' ? 'red' :
                              d.sub_thu_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t2 ? d.sub_thu_aft_t2 : ''}{d.grade_thu_aft_t2 ? d.grade_thu_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t2 === 'E' ? 'red' :
                          d.sub_thu_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t2 === 'Di' ? 'red' :
                              d.sub_thu_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t2 ? d.sub_thu_aft_t2 : ''}{d.grade_thu_aft_t2 ? d.grade_thu_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t2 === 'E' ? 'red' :
                          d.sub_thu_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t2 === 'Di' ? 'red' :
                              d.sub_thu_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t2 ? d.sub_thu_aft_t2 : ''}{d.grade_thu_aft_t2 ? d.grade_thu_aft_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t2 === 'E' ? 'red' :
                      d.sub_thu_aft_t2 === 'Bi' ? 'blue' :
                        d.sub_thu_aft_t2 === 'Di' ? 'red' :
                          d.sub_thu_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_aft_t2 ? d.sub_thu_aft_t2 : ''}{d.grade_thu_aft_t2 ? d.grade_thu_aft_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Thu_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t3 === 'E' ? 'red' :
                          d.sub_thu_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t3 === 'Di' ? 'red' :
                              d.sub_thu_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t3 ? d.sub_thu_aft_t3 : ''}{d.grade_thu_aft_t3 ? d.grade_thu_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t3 === 'E' ? 'red' :
                          d.sub_thu_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t3 === 'Di' ? 'red' :
                              d.sub_thu_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t3 ? d.sub_thu_aft_t3 : ''}{d.grade_thu_aft_t3 ? d.grade_thu_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t3 === 'E' ? 'red' :
                          d.sub_thu_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t3 === 'Di' ? 'red' :
                              d.sub_thu_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t3 ? d.sub_thu_aft_t3 : ''}{d.grade_thu_aft_t3 ? d.grade_thu_aft_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t3 === 'E' ? 'red' :
                      d.sub_thu_aft_t3 === 'Bi' ? 'blue' :
                        d.sub_thu_aft_t3 === 'Di' ? 'red' :
                          d.sub_thu_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_aft_t3 ? d.sub_thu_aft_t3 : ''}{d.grade_thu_aft_t3 ? d.grade_thu_aft_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Thu_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t4 === 'E' ? 'red' :
                          d.sub_thu_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t4 === 'Di' ? 'red' :
                              d.sub_thu_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t4 ? d.sub_thu_aft_t4 : ''}{d.grade_thu_aft_t4 ? d.grade_thu_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t4 === 'E' ? 'red' :
                          d.sub_thu_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t4 === 'Di' ? 'red' :
                              d.sub_thu_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t4 ? d.sub_thu_aft_t4 : ''}{d.grade_thu_aft_t4 ? d.grade_thu_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_thu_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_thu_aft_t4 === 'E' ? 'red' :
                          d.sub_thu_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_thu_aft_t4 === 'Di' ? 'red' :
                              d.sub_thu_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time4'}>{d.sub_thu_aft_t4 ? d.sub_thu_aft_t4 : ''}{d.grade_thu_aft_t4 ? d.grade_thu_aft_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_thu_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t4 === 'E' ? 'red' :
                      d.sub_thu_aft_t4 === 'Bi' ? 'blue' :
                        d.sub_thu_aft_t4 === 'Di' ? 'red' :
                          d.sub_thu_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4All'}>{d.sub_thu_aft_t4 ? d.sub_thu_aft_t4 : ''}{d.grade_thu_aft_t4 ? d.grade_thu_aft_t4 : ''}</td>
            })
          }
        </>
      )
    }
    const Fri_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t1 === 'E' ? 'red' :
                          d.sub_fri_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t1 === 'Di' ? 'red' :
                              d.sub_fri_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t1 ? d.sub_fri_mor_t1 : ''}{d.grade_fri_mor_t1 ? d.grade_fri_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t1 === 'E' ? 'red' :
                          d.sub_fri_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t1 === 'Di' ? 'red' :
                              d.sub_fri_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t1 ? d.sub_fri_mor_t1 : ''}{d.grade_fri_mor_t1 ? d.grade_fri_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t1 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t1 === 'E' ? 'red' :
                          d.sub_fri_mor_t1 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t1 === 'Di' ? 'red' :
                              d.sub_fri_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t1 ? d.sub_fri_mor_t1 : ''}{d.grade_fri_mor_t1 ? d.grade_fri_mor_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t1 === 'E' ? 'red' :
                      d.sub_fri_mor_t1 === 'Bi' ? 'blue' :
                        d.sub_fri_mor_t1 === 'Di' ? 'red' :
                          d.sub_fri_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5All'}>{d.sub_fri_mor_t1 ? d.sub_fri_mor_t1 : ''}{d.grade_fri_mor_t1 ? d.grade_fri_mor_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Fri_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t2 === 'E' ? 'red' :
                          d.sub_fri_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t2 === 'Di' ? 'red' :
                              d.sub_fri_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t2 ? d.sub_fri_mor_t2 : ''}{d.grade_fri_mor_t2 ? d.grade_fri_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t2 === 'E' ? 'red' :
                          d.sub_fri_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t2 === 'Di' ? 'red' :
                              d.sub_fri_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t2 ? d.sub_fri_mor_t2 : ''}{d.grade_fri_mor_t2 ? d.grade_fri_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t2 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t2 === 'E' ? 'red' :
                          d.sub_fri_mor_t2 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t2 === 'Di' ? 'red' :
                              d.sub_fri_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t2 ? d.sub_fri_mor_t2 : ''}{d.grade_fri_mor_t2 ? d.grade_fri_mor_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t2 === 'E' ? 'red' :
                      d.sub_fri_mor_t2 === 'Bi' ? 'blue' :
                        d.sub_fri_mor_t2 === 'Di' ? 'red' :
                          d.sub_fri_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5All'}>{d.sub_fri_mor_t2 ? d.sub_fri_mor_t2 : ''}{d.grade_fri_mor_t2 ? d.grade_fri_mor_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Fri_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t3 === 'E' ? 'red' :
                          d.sub_fri_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t3 === 'Di' ? 'red' :
                              d.sub_fri_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t3 ? d.sub_fri_mor_t3 : ''}{d.grade_fri_mor_t3 ? d.grade_fri_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t3 === 'E' ? 'red' :
                          d.sub_fri_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t3 === 'Di' ? 'red' :
                              d.sub_fri_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t3 ? d.sub_fri_mor_t3 : ''}{d.grade_fri_mor_t3 ? d.grade_fri_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t3 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t3 === 'E' ? 'red' :
                          d.sub_fri_mor_t3 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t3 === 'Di' ? 'red' :
                              d.sub_fri_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t3 ? d.sub_fri_mor_t3 : ''}{d.grade_fri_mor_t3 ? d.grade_fri_mor_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t3 === 'E' ? 'red' :
                      d.sub_fri_mor_t3 === 'Bi' ? 'blue' :
                        d.sub_fri_mor_t3 === 'Di' ? 'red' :
                          d.sub_fri_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5All'}>{d.sub_fri_mor_t3 ? d.sub_fri_mor_t3 : ''}{d.grade_fri_mor_t3 ? d.grade_fri_mor_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Fri_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t4 === 'E' ? 'red' :
                          d.sub_fri_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t4 === 'Di' ? 'red' :
                              d.sub_fri_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t4 ? d.sub_fri_mor_t4 : ''}{d.grade_fri_mor_t4 ? d.grade_fri_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t4 === 'E' ? 'red' :
                          d.sub_fri_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t4 === 'Di' ? 'red' :
                              d.sub_fri_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t4 ? d.sub_fri_mor_t4 : ''}{d.grade_fri_mor_t4 ? d.grade_fri_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_mor_t4 === 'PE' ? 'darkgreen' :
                        d.sub_fri_mor_t4 === 'E' ? 'red' :
                          d.sub_fri_mor_t4 === 'Bi' ? 'blue' :
                            d.sub_fri_mor_t4 === 'Di' ? 'red' :
                              d.sub_fri_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_mor_t4 ? d.sub_fri_mor_t4 : ''}{d.grade_fri_mor_t4 ? d.grade_fri_mor_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t4 === 'E' ? 'red' :
                      d.sub_fri_mor_t4 === 'Bi' ? 'blue' :
                        d.sub_fri_mor_t4 === 'Di' ? 'red' :
                          d.sub_fri_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5All'}>{d.sub_fri_mor_t4 ? d.sub_fri_mor_t4 : ''}{d.grade_fri_mor_t4 ? d.grade_fri_mor_t4 : ''}</td>
            })
          }
        </>
      )
    }

    const Fri_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t1 === 'E' ? 'red' :
                          d.sub_fri_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t1 === 'Di' ? 'red' :
                              d.sub_fri_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t1 ? d.sub_fri_aft_t1 : ''}{d.grade_fri_aft_t1 ? d.grade_fri_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t1 === 'E' ? 'red' :
                          d.sub_fri_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t1 === 'Di' ? 'red' :
                              d.sub_fri_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t1 ? d.sub_fri_aft_t1 : ''}{d.grade_fri_aft_t1 ? d.grade_fri_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t1 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t1 === 'E' ? 'red' :
                          d.sub_fri_aft_t1 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t1 === 'Di' ? 'red' :
                              d.sub_fri_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t1 ? d.sub_fri_aft_t1 : ''}{d.grade_fri_aft_t1 ? d.grade_fri_aft_t1 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t1 === 'E' ? 'red' :
                      d.sub_fri_aft_t1 === 'Bi' ? 'blue' :
                        d.sub_fri_aft_t1 === 'Di' ? 'red' :
                          d.sub_fri_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5All'}>{d.sub_fri_aft_t1 ? d.sub_fri_aft_t1 : ''}{d.grade_fri_aft_t1 ? d.grade_fri_aft_t1 : ''}</td>
            })
          }
        </>
      )
    }
    const Fri_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t2 === 'E' ? 'red' :
                          d.sub_fri_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t2 === 'Di' ? 'red' :
                              d.sub_fri_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t2 ? d.sub_fri_aft_t2 : ''}{d.grade_fri_aft_t2 ? d.grade_fri_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t2 === 'E' ? 'red' :
                          d.sub_fri_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t2 === 'Di' ? 'red' :
                              d.sub_fri_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t2 ? d.sub_fri_aft_t2 : ''}{d.grade_fri_aft_t2 ? d.grade_fri_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t2 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t2 === 'E' ? 'red' :
                          d.sub_fri_aft_t2 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t2 === 'Di' ? 'red' :
                              d.sub_fri_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t2 ? d.sub_fri_aft_t2 : ''}{d.grade_fri_aft_t2 ? d.grade_fri_aft_t2 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t2 === 'E' ? 'red' :
                      d.sub_fri_aft_t2 === 'Bi' ? 'blue' :
                        d.sub_fri_aft_t2 === 'Di' ? 'red' :
                          d.sub_fri_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5All'}>{d.sub_fri_aft_t2 ? d.sub_fri_aft_t2 : ''}{d.grade_fri_aft_t2 ? d.grade_fri_aft_t2 : ''}</td>
            })
          }
        </>
      )
    }
    const Fri_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t3 === 'E' ? 'red' :
                          d.sub_fri_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t3 === 'Di' ? 'red' :
                              d.sub_fri_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t3 ? d.sub_fri_aft_t3 : ''}{d.grade_fri_aft_t3 ? d.grade_fri_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t3 === 'E' ? 'red' :
                          d.sub_fri_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t3 === 'Di' ? 'red' :
                              d.sub_fri_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t3 ? d.sub_fri_aft_t3 : ''}{d.grade_fri_aft_t3 ? d.grade_fri_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t3 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t3 === 'E' ? 'red' :
                          d.sub_fri_aft_t3 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t3 === 'Di' ? 'red' :
                              d.sub_fri_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t3 ? d.sub_fri_aft_t3 : ''}{d.grade_fri_aft_t3 ? d.grade_fri_aft_t3 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t3 === 'E' ? 'red' :
                      d.sub_fri_aft_t3 === 'Bi' ? 'blue' :
                        d.sub_fri_aft_t3 === 'Di' ? 'red' :
                          d.sub_fri_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5All'}>{d.sub_fri_aft_t3 ? d.sub_fri_aft_t3 : ''}{d.grade_fri_aft_t3 ? d.grade_fri_aft_t3 : ''}</td>
            })
          }
        </>
      )
    }
    const Fri_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'general') {
              if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t4 === 'E' ? 'red' :
                          d.sub_fri_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t4 === 'Di' ? 'red' :
                              d.sub_fri_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t4 ? d.sub_fri_aft_t4 : ''}{d.grade_fri_aft_t4 ? d.grade_fri_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t4 === 'E' ? 'red' :
                          d.sub_fri_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t4 === 'Di' ? 'red' :
                              d.sub_fri_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t4 ? d.sub_fri_aft_t4 : ''}{d.grade_fri_aft_t4 ? d.grade_fri_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td
                    style={{
                      color: d.sub_fri_aft_t4 === 'PE' ? 'darkgreen' :
                        d.sub_fri_aft_t4 === 'E' ? 'red' :
                          d.sub_fri_aft_t4 === 'Bi' ? 'blue' :
                            d.sub_fri_aft_t4 === 'Di' ? 'red' :
                              d.sub_fri_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                    }}
                    className={d.nickname + 'time5'}>{d.sub_fri_aft_t4 ? d.sub_fri_aft_t4 : ''}{d.grade_fri_aft_t4 ? d.grade_fri_aft_t4 : ''}</td>
                }
              }
            }
          })}
          {
            dbAll.map((d, index) => {
              return <td
                style={{
                  color: d.sub_fri_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t4 === 'E' ? 'red' :
                      d.sub_fri_aft_t4 === 'Bi' ? 'blue' :
                        d.sub_fri_aft_t4 === 'Di' ? 'red' :
                          d.sub_fri_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }} className={d.nickname + 'time5All'}>{d.sub_fri_aft_t4 ? d.sub_fri_aft_t4 : ''}{d.grade_fri_aft_t4 ? d.grade_fri_aft_t4 : ''}</td>
            })
          }
        </>
      )
    }

    return (
      <>
        <div className="modal fade" id="forPreviewPrimary" tabindex="-1" aria-labelledby="forPreviewPrimary" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-body">
                <div class="content" id="time_tables">
                  <div class="container-fluid">
                    <div class="row">
                      <h4 class="card-title text-center">កាលវិភាគបង្រៀនថ្នាក់ <span>{selectTimeTable}</span>
                      </h4>
                      <div class="col-lg-12">
                        <div style={{ overflow: 'auto' }} >
                          <div id="myTable">

                            <table className="table table-bordered" ref={tableRef}>
                              <thead>
                                <tr id="head1">
                                  <th style={{ backgroundColor: "#8cafff" }} colspan="2">Teacher/Grade</th>
                                  <ShowName />
                                </tr>
                                <tr>
                                  <td colspan="2">Monday</td>
                                  <Count1 />

                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                  <Mon_mor_t1 />

                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                  <Mon_mor_t2 />

                                </tr>
                                <tr>
                                  <td>3</td>
                                  <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                  <Mon_mor_t3 />

                                </tr>
                                <tr>
                                  <td>4</td>
                                  <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                  <Mon_mor_t4 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                  <td >12:20-01:05</td>
                                  <Mon_aft_t1 />
                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                  <td>01:05-01:50</td>
                                  <Mon_aft_t2 />
                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                  <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                  <Mon_aft_t3 />
                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                  <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                  <Mon_aft_t4 />
                                </tr>
                                <tr>
                                  <td colspan="2">Tuesday</td>
                                  <Count2 />
                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                  <Tue_mor_t1 />

                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                  <Tue_mor_t2 />

                                </tr>
                                <tr>
                                  <td >3</td>
                                  <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                  <Tue_mor_t3 />

                                </tr>
                                <tr>
                                  <td>4</td>
                                  <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                  <Tue_mor_t4 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                  <td>12:20-01:05</td>
                                  <Tue_aft_t1 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                  <td>01:05-01:50</td>
                                  <Tue_aft_t2 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                  <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                  <Tue_aft_t3 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                  <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                  <Tue_aft_t4 />

                                </tr>
                                <tr>
                                  <td colspan="2">Wednesday</td>
                                  <Count3 />

                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                  <Wed_mor_t1 />

                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                  <Wed_mor_t2 />

                                </tr>
                                <tr>
                                  <td>3</td>
                                  <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                  <Wed_mor_t3 />

                                </tr>
                                <tr>
                                  <td>4</td>
                                  <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                  <Wed_mor_t4 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                  <td>12:20-01:05</td>
                                  <Wed_aft_t1 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                  <td>01:05-01:50</td>
                                  <Wed_aft_t2 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                  <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                  <Wed_aft_t3 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                  <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                  <Wed_aft_t4 />

                                </tr>
                                <tr>
                                  <td colspan="2">Thursday</td>
                                  <Count4 />

                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                  <Thu_mor_t1 />

                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                  <Thu_mor_t2 />

                                </tr>
                                <tr>
                                  <td>3</td>
                                  <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                  <Thu_mor_t3 />

                                </tr>
                                <tr>
                                  <td>4</td>
                                  <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                  <Thu_mor_t4 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                  <td>12:20-01:05</td>
                                  <Thu_aft_t1 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                  <td>01:05-01:50</td>
                                  <Thu_aft_t2 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                  <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                  <Thu_aft_t3 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                  <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                  <Thu_aft_t4 />

                                </tr>
                                <tr>
                                  <td colspan="2">Friday</td>
                                  <Count5 />

                                </tr>
                                <tr>
                                  <td>1</td>
                                  <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                  <Fri_mor_t1 />

                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                  <Fri_mor_t2 />

                                </tr>
                                <tr>
                                  <td>3</td>
                                  <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                  <Fri_mor_t3 />

                                </tr>
                                <tr>
                                  <td>4</td>
                                  <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                  <Fri_mor_t4 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                  <td>12:20-01:05</td>
                                  <Fri_aft_t1 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                  <td>01:05-01:50</td>
                                  <Fri_aft_t2 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                  <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                  <Fri_aft_t3 />

                                </tr>
                                <tr>
                                  <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                  <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                  <Fri_aft_t4 />

                                </tr>
                                <tr>
                                  <td colspan="2">Total</td>
                                  <TotalTime />
                                </tr>
                              </thead>
                              <tbody id="add_row">

                              </tbody>
                            </table>
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button
                  onClick={PrintPramary}
                  type="button" className="btn btn-primary">Printing</button>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }

  const PreviewEnglish = () => {
    const dbPreview = [...dataEn].sort((a, b) => a.t_grade.localeCompare(b.t_grade));

    const ShowName = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <th style={{ backgroundColor: "#8cafff" }}>{"T." + d.nickname}</th>
              {/* if (d.permission === 'yes') {
                } */}
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ backgroundColor: "#8cafff" }}>{"T." + d.nickname}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ backgroundColor: "#8cafff" }}>{"T." + d.nickname}</th>
                }
              } */}
            }
          })}
        </>
      )
    }

    const TotalTime = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              const total =
                parseFloat(d.total_time1) +
                parseFloat(d.total_time2) +
                parseFloat(d.total_time3) +
                parseFloat(d.total_time4) +
                parseFloat(d.total_time5)
              return <th style={{ color: 'red', fontWeight: 'bold', backgroundColor: '#defcf4' }}>{total}</th>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#defcf4' }}>{total}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#defcf4' }}>{total}</th>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Count1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time1}</th>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time1}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time1}</th>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Count2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time2}</th>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time2}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time2}</th>
                }
              } */}
            }
          }
          )}
        </>
      )
    }
    const Count3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time3}</th>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time3}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time3}</th>
                }
              } */}
            }
          }
          )}
        </>
      )
    }
    const Count4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time4}</th>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time4}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time4}</th>
                }
              } */}
            }
          }
          )}
        </>
      )
    }
    const Count5 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time5}</th>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time5}</th>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <th style={{ color: 'darkblue', fontWeight: 'bold', backgroundColor: '#fcf4de' }}>{d.total_time5}</th>
                }
              } */}
            }
          }
          )}
        </>
      )
    }
    const Mon_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_mon_mor_t1 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t1 === 'Di' ? 'red' :
                        d.sub_mon_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_mor_t1 ? d.sub_mon_mor_t1 : ''}{d.grade_mon_mor_t1 ? d.grade_mon_mor_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t1 ? d.sub_mon_mor_t1 : ''}{d.grade_mon_mor_t1 ? d.grade_mon_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t1 ? d.sub_mon_mor_t1 : ''}{d.grade_mon_mor_t1 ? d.grade_mon_mor_t1 : ''}</td>
                }
              } */}
            }
          }
          )}
        </>
      )
    }
    const Mon_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_mon_mor_t2 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t2 === 'Di' ? 'red' :
                        d.sub_mon_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_mor_t2 ? d.sub_mon_mor_t2 : ''}{d.grade_mon_mor_t2 ? d.grade_mon_mor_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t2 ? d.sub_mon_mor_t2 : ''}{d.grade_mon_mor_t2 ? d.grade_mon_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t2 ? d.sub_mon_mor_t2 : ''}{d.grade_mon_mor_t2 ? d.grade_mon_mor_t2 : ''}</td>
                }
              } */}
            }
          }
          )}
        </>
      )
    }
    const Mon_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_mon_mor_t3 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t3 === 'Di' ? 'red' :
                        d.sub_mon_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_mor_t3 ? d.sub_mon_mor_t3 : ''}{d.grade_mon_mor_t3 ? d.grade_mon_mor_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t3 ? d.sub_mon_mor_t3 : ''}{d.grade_mon_mor_t3 ? d.grade_mon_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t3 ? d.sub_mon_mor_t3 : ''}{d.grade_mon_mor_t3 ? d.grade_mon_mor_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Mon_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_mon_mor_t4 === 'Bi' ? 'blue' :
                      d.sub_mon_mor_t4 === 'Di' ? 'red' :
                        d.sub_mon_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_mor_t4 ? d.sub_mon_mor_t4 : ''}{d.grade_mon_mor_t4 ? d.grade_mon_mor_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t4 ? d.sub_mon_mor_t4 : ''}{d.grade_mon_mor_t4 ? d.grade_mon_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_mor_t4 ? d.sub_mon_mor_t4 : ''}{d.grade_mon_mor_t4 ? d.grade_mon_mor_t4 : ''}</td>
                }
              } */}
            }

          })}
        </>
      )
    }
    const Mon_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t1 === 'Bi' ? 'blue' :
                      d.sub_mon_aft_t1 === 'Di' ? 'red' :
                        d.sub_mon_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_aft_t1 ? d.sub_mon_aft_t1 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t1 ? d.sub_mon_aft_t1 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t1 ? d.sub_mon_aft_t1 : ''}{d.grade_mon_aft_t1 ? d.grade_mon_aft_t1 : ''}</td>
                }
              } */}
            }

          })}
        </>
      )
    }
    const Mon_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t2 === 'Bi' ? 'blue' :
                      d.sub_mon_aft_t2 === 'Di' ? 'red' :
                        d.sub_mon_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_aft_t2 ? d.sub_mon_aft_t2 : ''}{d.grade_mon_aft_t2 ? d.grade_mon_aft_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t2 ? d.sub_mon_aft_t2 : ''}{d.grade_mon_aft_t2 ? d.grade_mon_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t2 ? d.sub_mon_aft_t2 : ''}{d.grade_mon_aft_t2 ? d.grade_mon_aft_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Mon_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t3 === 'Bi' ? 'blue' :
                      d.sub_mon_aft_t3 === 'Di' ? 'red' :
                        d.sub_mon_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_aft_t3 ? d.sub_mon_aft_t3 : ''}{d.grade_mon_aft_t3 ? d.grade_mon_aft_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t3 ? d.sub_mon_aft_t3 : ''}{d.grade_mon_aft_t3 ? d.grade_mon_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t3 ? d.sub_mon_aft_t3 : ''}{d.grade_mon_aft_t3 ? d.grade_mon_aft_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Mon_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_mon_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_mon_aft_t4 === 'Bi' ? 'blue' :
                      d.sub_mon_aft_t4 === 'Di' ? 'red' :
                        d.sub_mon_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time1En'}>{d.sub_mon_aft_t4 ? d.sub_mon_aft_t4 : ''}{d.grade_mon_aft_t4 ? d.grade_mon_aft_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t4 ? d.sub_mon_aft_t4 : ''}{d.grade_mon_aft_t4 ? d.grade_mon_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time1En'}>{d.sub_mon_aft_t4 ? d.sub_mon_aft_t4 : ''}{d.grade_mon_aft_t4 ? d.grade_mon_aft_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Tue_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t1 === 'Bi' ? 'blue' :
                      d.sub_tue_mor_t1 === 'Di' ? 'red' :
                        d.sub_tue_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_mor_t1 ? d.sub_tue_mor_t1 : ''}{d.grade_tue_mor_t1 ? d.grade_tue_mor_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t1 ? d.sub_tue_mor_t1 : ''}{d.grade_tue_mor_t1 ? d.grade_tue_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t1 ? d.sub_tue_mor_t1 : ''}{d.grade_tue_mor_t1 ? d.grade_tue_mor_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Tue_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t2 === 'Bi' ? 'blue' :
                      d.sub_tue_mor_t2 === 'Di' ? 'red' :
                        d.sub_tue_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_mor_t2 ? d.sub_tue_mor_t2 : ''}{d.grade_tue_mor_t2 ? d.grade_tue_mor_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t2 ? d.sub_tue_mor_t2 : ''}{d.grade_tue_mor_t2 ? d.grade_tue_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t2 ? d.sub_tue_mor_t2 : ''}{d.grade_tue_mor_t2 ? d.grade_tue_mor_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Tue_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t3 === 'Bi' ? 'blue' :
                      d.sub_tue_mor_t3 === 'Di' ? 'red' :
                        d.sub_tue_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_mor_t3 ? d.sub_tue_mor_t3 : ''}{d.grade_tue_mor_t3 ? d.grade_tue_mor_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t3 ? d.sub_tue_mor_t3 : ''}{d.grade_tue_mor_t3 ? d.grade_tue_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t3 ? d.sub_tue_mor_t3 : ''}{d.grade_tue_mor_t3 ? d.grade_tue_mor_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Tue_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_tue_mor_t4 === 'Bi' ? 'blue' :
                      d.sub_tue_mor_t4 === 'Di' ? 'red' :
                        d.sub_tue_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_mor_t4 ? d.sub_tue_mor_t4 : ''}{d.grade_tue_mor_t4 ? d.grade_tue_mor_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t4 ? d.sub_tue_mor_t4 : ''}{d.grade_tue_mor_t4 ? d.grade_tue_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_mor_t4 ? d.sub_tue_mor_t4 : ''}{d.grade_tue_mor_t4 ? d.grade_tue_mor_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }

    const Tue_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t1 === 'Bi' ? 'blue' :
                      d.sub_tue_aft_t1 === 'Di' ? 'red' :
                        d.sub_tue_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_aft_t1 ? d.sub_tue_aft_t1 : ''}{d.grade_tue_aft_t1 ? d.grade_tue_aft_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t1 ? d.sub_tue_aft_t1 : ''}{d.grade_tue_aft_t1 ? d.grade_tue_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t1 ? d.sub_tue_aft_t1 : ''}{d.grade_tue_aft_t1 ? d.grade_tue_aft_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Tue_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t2 === 'Bi' ? 'blue' :
                      d.sub_tue_aft_t2 === 'Di' ? 'red' :
                        d.sub_tue_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_aft_t2 ? d.sub_tue_aft_t2 : ''}{d.grade_tue_aft_t2 ? d.grade_tue_aft_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t2 ? d.sub_tue_aft_t2 : ''}{d.grade_tue_aft_t2 ? d.grade_tue_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t2 ? d.sub_tue_aft_t2 : ''}{d.grade_tue_aft_t2 ? d.grade_tue_aft_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Tue_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t3 === 'Bi' ? 'blue' :
                      d.sub_tue_aft_t3 === 'Di' ? 'red' :
                        d.sub_tue_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_aft_t3 ? d.sub_tue_aft_t3 : ''}{d.grade_tue_aft_t3 ? d.grade_tue_aft_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t3 ? d.sub_tue_aft_t3 : ''}{d.grade_tue_aft_t3 ? d.grade_tue_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t3 ? d.sub_tue_aft_t3 : ''}{d.grade_tue_aft_t3 ? d.grade_tue_aft_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Tue_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_tue_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_tue_aft_t4 === 'Bi' ? 'blue' :
                      d.sub_tue_aft_t4 === 'Di' ? 'red' :
                        d.sub_tue_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time2En'}>{d.sub_tue_aft_t4 ? d.sub_tue_aft_t4 : ''}{d.grade_tue_aft_t4 ? d.grade_tue_aft_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t4 ? d.sub_tue_aft_t4 : ''}{d.grade_tue_aft_t4 ? d.grade_tue_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time2En'}>{d.sub_tue_aft_t4 ? d.sub_tue_aft_t4 : ''}{d.grade_tue_aft_t4 ? d.grade_tue_aft_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Wed_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t1 === 'Bi' ? 'blue' :
                      d.sub_wed_mor_t1 === 'Di' ? 'red' :
                        d.sub_wed_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_mor_t1 ? d.sub_wed_mor_t1 : ''}{d.grade_wed_mor_t1 ? d.grade_wed_mor_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t1 ? d.sub_wed_mor_t1 : ''}{d.grade_wed_mor_t1 ? d.grade_wed_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t1 ? d.sub_wed_mor_t1 : ''}{d.grade_wed_mor_t1 ? d.grade_wed_mor_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Wed_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t2 === 'Bi' ? 'blue' :
                      d.sub_wed_mor_t2 === 'Di' ? 'red' :
                        d.sub_wed_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_mor_t2 ? d.sub_wed_mor_t2 : ''}{d.grade_wed_mor_t2 ? d.grade_wed_mor_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t2 ? d.sub_wed_mor_t2 : ''}{d.grade_wed_mor_t2 ? d.grade_wed_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t2 ? d.sub_wed_mor_t2 : ''}{d.grade_wed_mor_t2 ? d.grade_wed_mor_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Wed_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t3 === 'Bi' ? 'blue' :
                      d.sub_wed_mor_t3 === 'Di' ? 'red' :
                        d.sub_wed_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_mor_t3 ? d.sub_wed_mor_t3 : ''}{d.grade_wed_mor_t3 ? d.grade_wed_mor_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t3 ? d.sub_wed_mor_t3 : ''}{d.grade_wed_mor_t3 ? d.grade_wed_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t3 ? d.sub_wed_mor_t3 : ''}{d.grade_wed_mor_t3 ? d.grade_wed_mor_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Wed_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_wed_mor_t4 === 'Bi' ? 'blue' :
                      d.sub_wed_mor_t4 === 'Di' ? 'red' :
                        d.sub_wed_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_mor_t4 ? d.sub_wed_mor_t4 : ''}{d.grade_wed_mor_t4 ? d.grade_wed_mor_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t4 ? d.sub_wed_mor_t4 : ''}{d.grade_wed_mor_t4 ? d.grade_wed_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_mor_t4 ? d.sub_wed_mor_t4 : ''}{d.grade_wed_mor_t4 ? d.grade_wed_mor_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }

    const Wed_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t1 === 'Bi' ? 'blue' :
                      d.sub_wed_aft_t1 === 'Di' ? 'red' :
                        d.sub_wed_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_aft_t1 ? d.sub_wed_aft_t1 : ''}{d.grade_wed_aft_t1 ? d.grade_wed_aft_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t1 ? d.sub_wed_aft_t1 : ''}{d.grade_wed_aft_t1 ? d.grade_wed_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t1 ? d.sub_wed_aft_t1 : ''}{d.grade_wed_aft_t1 ? d.grade_wed_aft_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Wed_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t2 === 'Bi' ? 'blue' :
                      d.sub_wed_aft_t2 === 'Di' ? 'red' :
                        d.sub_wed_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_aft_t2 ? d.sub_wed_aft_t2 : ''}{d.grade_wed_aft_t2 ? d.grade_wed_aft_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t2 ? d.sub_wed_aft_t2 : ''}{d.grade_wed_aft_t2 ? d.grade_wed_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t2 ? d.sub_wed_aft_t2 : ''}{d.grade_wed_aft_t2 ? d.grade_wed_aft_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Wed_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t3 === 'Bi' ? 'blue' :
                      d.sub_wed_aft_t3 === 'Di' ? 'red' :
                        d.sub_wed_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_aft_t3 ? d.sub_wed_aft_t3 : ''}{d.grade_wed_aft_t3 ? d.grade_wed_aft_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t3 ? d.sub_wed_aft_t3 : ''}{d.grade_wed_aft_t3 ? d.grade_wed_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t3 ? d.sub_wed_aft_t3 : ''}{d.grade_wed_aft_t3 ? d.grade_wed_aft_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Wed_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_wed_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_wed_aft_t4 === 'Bi' ? 'blue' :
                      d.sub_wed_aft_t4 === 'Di' ? 'red' :
                        d.sub_wed_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time3En'}>{d.sub_wed_aft_t4 ? d.sub_wed_aft_t4 : ''}{d.grade_wed_aft_t4 ? d.grade_wed_aft_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t4 ? d.sub_wed_aft_t4 : ''}{d.grade_wed_aft_t4 ? d.grade_wed_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time3En'}>{d.sub_wed_aft_t4 ? d.sub_wed_aft_t4 : ''}{d.grade_wed_aft_t4 ? d.grade_wed_aft_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Thu_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t1 === 'Bi' ? 'blue' :
                      d.sub_thu_mor_t1 === 'Di' ? 'red' :
                        d.sub_thu_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_mor_t1 ? d.sub_thu_mor_t1 : ''}{d.grade_thu_mor_t1 ? d.grade_thu_mor_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t1 ? d.sub_thu_mor_t1 : ''}{d.grade_thu_mor_t1 ? d.grade_thu_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t1 ? d.sub_thu_mor_t1 : ''}{d.grade_thu_mor_t1 ? d.grade_thu_mor_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Thu_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t2 === 'Bi' ? 'blue' :
                      d.sub_thu_mor_t2 === 'Di' ? 'red' :
                        d.sub_thu_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_mor_t2 ? d.sub_thu_mor_t2 : ''}{d.grade_thu_mor_t2 ? d.grade_thu_mor_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t2 ? d.sub_thu_mor_t2 : ''}{d.grade_thu_mor_t2 ? d.grade_thu_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t2 ? d.sub_thu_mor_t2 : ''}{d.grade_thu_mor_t2 ? d.grade_thu_mor_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Thu_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t3 === 'Bi' ? 'blue' :
                      d.sub_thu_mor_t3 === 'Di' ? 'red' :
                        d.sub_thu_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_mor_t3 ? d.sub_thu_mor_t3 : ''}{d.grade_thu_mor_t3 ? d.grade_thu_mor_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t3 ? d.sub_thu_mor_t3 : ''}{d.grade_thu_mor_t3 ? d.grade_thu_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t3 ? d.sub_thu_mor_t3 : ''}{d.grade_thu_mor_t3 ? d.grade_thu_mor_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Thu_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_thu_mor_t4 === 'Bi' ? 'blue' :
                      d.sub_thu_mor_t4 === 'Di' ? 'red' :
                        d.sub_thu_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_mor_t4 ? d.sub_thu_mor_t4 : ''}{d.grade_thu_mor_t4 ? d.grade_thu_mor_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t4 ? d.sub_thu_mor_t4 : ''}{d.grade_thu_mor_t4 ? d.grade_thu_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_mor_t4 ? d.sub_thu_mor_t4 : ''}{d.grade_thu_mor_t4 ? d.grade_thu_mor_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }

    const Thu_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t1 === 'Bi' ? 'blue' :
                      d.sub_thu_aft_t1 === 'Di' ? 'red' :
                        d.sub_thu_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_aft_t1 ? d.sub_thu_aft_t1 : ''}{d.grade_thu_aft_t1 ? d.grade_thu_aft_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t1 ? d.sub_thu_aft_t1 : ''}{d.grade_thu_aft_t1 ? d.grade_thu_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t1 ? d.sub_thu_aft_t1 : ''}{d.grade_thu_aft_t1 ? d.grade_thu_aft_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Thu_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t2 === 'Bi' ? 'blue' :
                      d.sub_thu_aft_t2 === 'Di' ? 'red' :
                        d.sub_thu_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_aft_t2 ? d.sub_thu_aft_t2 : ''}{d.grade_thu_aft_t2 ? d.grade_thu_aft_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t2 ? d.sub_thu_aft_t2 : ''}{d.grade_thu_aft_t2 ? d.grade_thu_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t2 ? d.sub_thu_aft_t2 : ''}{d.grade_thu_aft_t2 ? d.grade_thu_aft_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Thu_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t3 === 'Bi' ? 'blue' :
                      d.sub_thu_aft_t3 === 'Di' ? 'red' :
                        d.sub_thu_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_aft_t3 ? d.sub_thu_aft_t3 : ''}{d.grade_thu_aft_t3 ? d.grade_thu_aft_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t3 ? d.sub_thu_aft_t3 : ''}{d.grade_thu_aft_t3 ? d.grade_thu_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t3 ? d.sub_thu_aft_t3 : ''}{d.grade_thu_aft_t3 ? d.grade_thu_aft_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Thu_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_thu_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_thu_aft_t4 === 'Bi' ? 'blue' :
                      d.sub_thu_aft_t4 === 'Di' ? 'red' :
                        d.sub_thu_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time4En'}>{d.sub_thu_aft_t4 ? d.sub_thu_aft_t4 : ''}{d.grade_thu_aft_t4 ? d.grade_thu_aft_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t4 ? d.sub_thu_aft_t4 : ''}{d.grade_thu_aft_t4 ? d.grade_thu_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time4En'}>{d.sub_thu_aft_t4 ? d.sub_thu_aft_t4 : ''}{d.grade_thu_aft_t4 ? d.grade_thu_aft_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Fri_mor_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_mor_t1 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t1 === 'Bi' ? 'blue' :
                      d.sub_fri_mor_t1 === 'Di' ? 'red' :
                        d.sub_fri_mor_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_mor_t1 ? d.sub_fri_mor_t1 : ''}{d.grade_fri_mor_t1 ? d.grade_fri_mor_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t1 ? d.sub_fri_mor_t1 : ''}{d.grade_fri_mor_t1 ? d.grade_fri_mor_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t1 ? d.sub_fri_mor_t1 : ''}{d.grade_fri_mor_t1 ? d.grade_fri_mor_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Fri_mor_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_mor_t2 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t2 === 'Bi' ? 'blue' :
                      d.sub_fri_mor_t2 === 'Di' ? 'red' :
                        d.sub_fri_mor_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_mor_t2 ? d.sub_fri_mor_t2 : ''}{d.grade_fri_mor_t2 ? d.grade_fri_mor_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t2 ? d.sub_fri_mor_t2 : ''}{d.grade_fri_mor_t2 ? d.grade_fri_mor_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t2 ? d.sub_fri_mor_t2 : ''}{d.grade_fri_mor_t2 ? d.grade_fri_mor_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Fri_mor_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_mor_t3 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t3 === 'Bi' ? 'blue' :
                      d.sub_fri_mor_t3 === 'Di' ? 'red' :
                        d.sub_fri_mor_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_mor_t3 ? d.sub_fri_mor_t3 : ''}{d.grade_fri_mor_t3 ? d.grade_fri_mor_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t3 ? d.sub_fri_mor_t3 : ''}{d.grade_fri_mor_t3 ? d.grade_fri_mor_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t3 ? d.sub_fri_mor_t3 : ''}{d.grade_fri_mor_t3 ? d.grade_fri_mor_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Fri_mor_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_mor_t4 === 'PE' ? 'darkgreen' :
                    d.sub_fri_mor_t4 === 'Bi' ? 'blue' :
                      d.sub_fri_mor_t4 === 'Di' ? 'red' :
                        d.sub_fri_mor_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_mor_t4 ? d.sub_fri_mor_t4 : ''}{d.grade_fri_mor_t4 ? d.grade_fri_mor_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t4 ? d.sub_fri_mor_t4 : ''}{d.grade_fri_mor_t4 ? d.grade_fri_mor_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_mor_t4 ? d.sub_fri_mor_t4 : ''}{d.grade_fri_mor_t4 ? d.grade_fri_mor_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }

    const Fri_aft_t1 = () => {

      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_aft_t1 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t1 === 'Bi' ? 'blue' :
                      d.sub_fri_aft_t1 === 'Di' ? 'red' :
                        d.sub_fri_aft_t1 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_aft_t1 ? d.sub_fri_aft_t1 : ''}{d.grade_fri_aft_t1 ? d.grade_fri_aft_t1 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t1 ? d.sub_fri_aft_t1 : ''}{d.grade_fri_aft_t1 ? d.grade_fri_aft_t1 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t1 ? d.sub_fri_aft_t1 : ''}{d.grade_fri_aft_t1 ? d.grade_fri_aft_t1 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Fri_aft_t2 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_aft_t2 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t2 === 'Bi' ? 'blue' :
                      d.sub_fri_aft_t2 === 'Di' ? 'red' :
                        d.sub_fri_aft_t2 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_aft_t2 ? d.sub_fri_aft_t2 : ''}{d.grade_fri_aft_t2 ? d.grade_fri_aft_t2 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t2 ? d.sub_fri_aft_t2 : ''}{d.grade_fri_aft_t2 ? d.grade_fri_aft_t2 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t2 ? d.sub_fri_aft_t2 : ''}{d.grade_fri_aft_t2 ? d.grade_fri_aft_t2 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Fri_aft_t3 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_aft_t3 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t3 === 'Bi' ? 'blue' :
                      d.sub_fri_aft_t3 === 'Di' ? 'red' :
                        d.sub_fri_aft_t3 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_aft_t3 ? d.sub_fri_aft_t3 : ''}{d.grade_fri_aft_t3 ? d.grade_fri_aft_t3 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t3 ? d.sub_fri_aft_t3 : ''}{d.grade_fri_aft_t3 ? d.grade_fri_aft_t3 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t3 ? d.sub_fri_aft_t3 : ''}{d.grade_fri_aft_t3 ? d.grade_fri_aft_t3 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }
    const Fri_aft_t4 = () => {
      return (
        <>
          {dbPreview.map((d, index) => {
            if (d.teacher_type === 'english') {
              return <td
                style={{
                  color: d.sub_fri_aft_t4 === 'PE' ? 'darkgreen' :
                    d.sub_fri_aft_t4 === 'Bi' ? 'blue' :
                      d.sub_fri_aft_t4 === 'Di' ? 'red' :
                        d.sub_fri_aft_t4 === 'Ac' ? 'darkred' : 'inherit'
                }}
                className={d.nickname + 'time5En'}>{d.sub_fri_aft_t4 ? d.sub_fri_aft_t4 : ''}{d.grade_fri_aft_t4 ? d.grade_fri_aft_t4 : ''}</td>
              {/* if (selectTimeTable === 'បឋមសិក្សា') {
                if (d.permission === 'yes') {
                }
              }
              if (selectTimeTable === 'អនុវិទ្យាល័យ') {
                if (d.permission === 'no') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t4 ? d.sub_fri_aft_t4 : ''}{d.grade_fri_aft_t4 ? d.grade_fri_aft_t4 : ''}</td>
                }
              }
              if (selectTimeTable === 'វិទ្យាល័យ') {
                if (d.permission === 'ok') {
                  return <td className={d.nickname + 'time5En'}>{d.sub_fri_aft_t4 ? d.sub_fri_aft_t4 : ''}{d.grade_fri_aft_t4 ? d.grade_fri_aft_t4 : ''}</td>
                }
              } */}
            }
          })}
        </>
      )
    }

    return (
      <>
        <div className="modal fade" id="forPreviewEnglish" tabindex="-1" aria-labelledby="forPreviewPrimary" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-body">
                <div class="content" id="time_tables">
                  <div class="container-fluid">
                    <div class="row">
                      <h4 class="card-title text-center">កាលវិភាគរួមភាសាអង់គ្លេស <span>{selectTimeTable}</span>
                      </h4>
                      <div class="col-lg-12">
                        <div style={{ overflow: 'auto' }} id="show_mouse">
                          <table className="table table-bordered" id="myTableEnglish" ref={tableRef}>
                            <thead>
                              <tr id="head1">
                                <th style={{ backgroundColor: "#8cafff" }} colspan="2">Teacher/Grade</th>
                                <ShowName />
                              </tr>
                              <tr>
                                <td colspan="2">Monday</td>
                                <Count1 />

                              </tr>
                              <tr>
                                <td>1</td>
                                <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                <Mon_mor_t1 />

                              </tr>
                              <tr>
                                <td>2</td>
                                <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                <Mon_mor_t2 />

                              </tr>
                              <tr>
                                <td>3</td>
                                <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                <Mon_mor_t3 />

                              </tr>
                              <tr>
                                <td>4</td>
                                <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                <Mon_mor_t4 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                <td>12:20-01:05</td>
                                <Mon_aft_t1 />
                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}> 2</td>
                                <td>01:05-01:50</td>
                                <Mon_aft_t2 />
                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                <Mon_aft_t3 />
                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                <Mon_aft_t4 />
                              </tr>
                              <tr>
                                <td colspan="2">Tuesday</td>
                                <Count2 />
                              </tr>
                              <tr>
                                <td>1</td>
                                <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                <Tue_mor_t1 />

                              </tr>
                              <tr>
                                <td>2</td>
                                <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                <Tue_mor_t2 />

                              </tr>
                              <tr>
                                <td>3</td>
                                <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                <Tue_mor_t3 />

                              </tr>
                              <tr>
                                <td>4</td>
                                <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                <Tue_mor_t4 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                <td>12:20-01:05</td>
                                <Tue_aft_t1 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                <td>01:05-01:50</td>
                                <Tue_aft_t2 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                <Tue_aft_t3 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                <Tue_aft_t4 />

                              </tr>
                              <tr>
                                <td colspan="2">Wednesday</td>
                                <Count3 />

                              </tr>
                              <tr>
                                <td>1</td>
                                <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                <Wed_mor_t1 />

                              </tr>
                              <tr>
                                <td>2</td>
                                <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                <Wed_mor_t2 />

                              </tr>
                              <tr>
                                <td>3</td>
                                <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                <Wed_mor_t3 />

                              </tr>
                              <tr>
                                <td>4</td>
                                <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                <Wed_mor_t4 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                <td>12:20-01:05</td>
                                <Wed_aft_t1 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                <td>01:05-01:50</td>
                                <Wed_aft_t2 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                <Wed_aft_t3 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                <Wed_aft_t4 />

                              </tr>
                              <tr>
                                <td colspan="2">Thursday</td>
                                <Count4 />

                              </tr>
                              <tr>
                                <td>1</td>
                                <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                <Thu_mor_t1 />

                              </tr>
                              <tr>
                                <td>2</td>
                                <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                <Thu_mor_t2 />

                              </tr>
                              <tr>
                                <td>3</td>
                                <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                <Thu_mor_t3 />

                              </tr>
                              <tr>
                                <td>4</td>
                                <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                <Thu_mor_t4 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                <td>12:20-01:05</td>
                                <Thu_aft_t1 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                <td>01:05-01:50</td>
                                <Thu_aft_t2 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                <Thu_aft_t3 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                <Thu_aft_t4 />

                              </tr>
                              <tr>
                                <td colspan="2">Friday</td>
                                <Count5 />

                              </tr>
                              <tr>
                                <td>1</td>
                                <td style={{ color: 'darkblue' }}>08:00-08:45</td>
                                <Fri_mor_t1 />

                              </tr>
                              <tr>
                                <td>2</td>
                                <td style={{ color: 'darkblue' }}>08:45-09:30</td>
                                <Fri_mor_t2 />

                              </tr>
                              <tr>
                                <td>3</td>
                                <td style={{ color: '#b325d6' }}>09:50-10:35</td>
                                <Fri_mor_t3 />

                              </tr>
                              <tr>
                                <td>4</td>
                                <td style={{ color: '#b325d6' }}>10:35-11:20</td>
                                <Fri_mor_t4 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>1</td>
                                <td>12:20-01:05</td>
                                <Fri_aft_t1 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>2</td>
                                <td>01:05-01:50</td>
                                <Fri_aft_t2 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>3</td>
                                <td style={{ color: 'darkred' }}>02:05-02:50</td>
                                <Fri_aft_t3 />

                              </tr>
                              <tr>
                                <td style={{ backgroundColor: 'lightblue' }}>4</td>
                                <td style={{ color: 'darkred' }}>02:50-03:35</td>
                                <Fri_aft_t4 />

                              </tr>
                              <tr>
                                <td colspan="2">Total</td>
                                <TotalTime />
                              </tr>
                            </thead>
                            <tbody id="add_row">

                            </tbody>
                          </table>
                          <div id="subject-menu" class="popup">
                            <p>Select Subject:</p>
                            <select id="subject-select">
                              <option value="">-- Select Subject --</option>
                              <option value="M">Math</option>
                              <option value="K">Khmer</option>
                            </select>
                          </div>
                          <div id="teacher-menu" class="popup">
                            <p>Select Grade:</p>
                            <p id="close">Close</p>
                            <select id="teacher-select">
                              <option value="">-- Select Teacher --</option>
                              <option value="1A">1A</option>
                              <option value="2A">2A</option>
                              <option value="3A">3A</option>
                              <option value="4A">4A</option>
                              <option value="1B">1B</option>
                              <option value="2B">2B</option>
                              <option value="3B">3B</option>
                              <option value="4B">4B</option>
                            </select>
                            <button id="btn_submit">OK</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button
                  onClick={PrintEnglish}
                  type="button" className="btn btn-primary">Printing</button>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }

  let n = 0
  let n0 = '';
  let num = '';

  n++

  const user_id = useRef(null)
  const user_tc = useRef(null)
  const user_img = useRef(null)
  const set_user_img = useRef(null)
  const user_sub = useRef(null)
  const set_user_sub = useRef(null)
  const [user_g, setUser_g] = useState('')
  const [showGradePrint, setshowGradePrint] = useState('')
  // const user_nick = useRef(null)
  const [data_cell, setdata_cell] = useState('')
  const [user_nick, setuser_nick] = useState('')


  //Array Check the same teachers
  //Monday
  let data_row_1 = [];
  let data_row_2 = [];
  let data_row_3 = [];
  let data_row_4 = [];
  let data_row_5 = [];
  let data_row_6 = [];
  let data_row_7 = [];
  let data_row_8 = [];
  //Tuesday
  let data_row_9 = [];
  let data_row_10 = [];
  let data_row_11 = [];
  let data_row_12 = [];
  let data_row_13 = [];
  let data_row_14 = [];
  let data_row_15 = [];
  let data_row_16 = [];
  //Wednesday
  let data_row_17 = [];
  let data_row_18 = [];
  let data_row_19 = [];
  let data_row_20 = [];
  let data_row_21 = [];
  let data_row_22 = [];
  let data_row_23 = [];
  let data_row_24 = [];

  //Thursday
  let data_row_25 = [];
  let data_row_26 = [];
  let data_row_27 = [];
  let data_row_28 = [];
  let data_row_29 = [];
  let data_row_30 = [];
  let data_row_31 = [];
  let data_row_32 = [];

  //Friday
  let data_row_33 = [];
  let data_row_34 = [];
  let data_row_35 = [];
  let data_row_36 = [];
  let data_row_37 = [];
  let data_row_38 = [];
  let data_row_39 = [];
  let data_row_40 = [];

  const getID = (e) => {
    const id = e.currentTarget.dataset.myid
    setshowGradePrint(id)
    //Preview Time Table
    let preview = document.getElementById(`${id}pre`);
    // preview.addEventListener('click', () => {
    //Subjects
    if (preview.dataset.sub_mon_mor_t1 == undefined) {
      var sub_mon_mor_t1 = '';

    } else {
      var sub_mon_mor_t1 = preview.dataset.sub_mon_mor_t1;

    }
    var get_head_teacher = preview.dataset.headteacher;
    setgetHeadTeacher(get_head_teacher)

    var sub_mon_mor_t2 = preview.dataset.sub_mon_mor_t2;
    var sub_mon_mor_t3 = preview.dataset.sub_mon_mor_t3;
    var sub_mon_mor_t4 = preview.dataset.sub_mon_mor_t4;
    var sub_mon_aft_t1 = preview.dataset.sub_mon_aft_t1;
    var sub_mon_aft_t2 = preview.dataset.sub_mon_aft_t2;
    var sub_mon_aft_t3 = preview.dataset.sub_mon_aft_t3;
    var sub_mon_aft_t4 = preview.dataset.sub_mon_aft_t4;

    var sub_tue_mor_t1 = preview.dataset.sub_tue_mor_t1;
    var sub_tue_mor_t2 = preview.dataset.sub_tue_mor_t2;
    var sub_tue_mor_t3 = preview.dataset.sub_tue_mor_t3;
    var sub_tue_mor_t4 = preview.dataset.sub_tue_mor_t4;
    var sub_tue_aft_t1 = preview.dataset.sub_tue_aft_t1;
    var sub_tue_aft_t2 = preview.dataset.sub_tue_aft_t2;
    var sub_tue_aft_t3 = preview.dataset.sub_tue_aft_t3;
    var sub_tue_aft_t4 = preview.dataset.sub_tue_aft_t4;

    var sub_wed_mor_t1 = preview.dataset.sub_wed_mor_t1;
    var sub_wed_mor_t2 = preview.dataset.sub_wed_mor_t2;
    var sub_wed_mor_t3 = preview.dataset.sub_wed_mor_t3;
    var sub_wed_mor_t4 = preview.dataset.sub_wed_mor_t4;
    var sub_wed_aft_t1 = preview.dataset.sub_wed_aft_t1;
    var sub_wed_aft_t2 = preview.dataset.sub_wed_aft_t2;
    var sub_wed_aft_t3 = preview.dataset.sub_wed_aft_t3;
    var sub_wed_aft_t4 = preview.dataset.sub_wed_aft_t4;

    var sub_thu_mor_t1 = preview.dataset.sub_thu_mor_t1;
    var sub_thu_mor_t2 = preview.dataset.sub_thu_mor_t2;
    var sub_thu_mor_t3 = preview.dataset.sub_thu_mor_t3;
    var sub_thu_mor_t4 = preview.dataset.sub_thu_mor_t4;
    var sub_thu_aft_t1 = preview.dataset.sub_thu_aft_t1;
    var sub_thu_aft_t2 = preview.dataset.sub_thu_aft_t2;
    var sub_thu_aft_t3 = preview.dataset.sub_thu_aft_t3;
    var sub_thu_aft_t4 = preview.dataset.sub_thu_aft_t4;

    var sub_fri_mor_t1 = preview.dataset.sub_fri_mor_t1;
    var sub_fri_mor_t2 = preview.dataset.sub_fri_mor_t2;
    var sub_fri_mor_t3 = preview.dataset.sub_fri_mor_t3;
    var sub_fri_mor_t4 = preview.dataset.sub_fri_mor_t4;
    var sub_fri_aft_t1 = preview.dataset.sub_fri_aft_t1;
    var sub_fri_aft_t2 = preview.dataset.sub_fri_aft_t2;
    var sub_fri_aft_t3 = preview.dataset.sub_fri_aft_t3;
    var sub_fri_aft_t4 = preview.dataset.sub_fri_aft_t4;

    //Teacher name
    var tname_mon_mor_t1 = preview.dataset.tname_mon_mor_t1;
    var tname_mon_mor_t2 = preview.dataset.tname_mon_mor_t2;
    var tname_mon_mor_t3 = preview.dataset.tname_mon_mor_t3;
    var tname_mon_mor_t4 = preview.dataset.tname_mon_mor_t4;
    var tname_mon_aft_t1 = preview.dataset.tname_mon_aft_t1;
    var tname_mon_aft_t2 = preview.dataset.tname_mon_aft_t2;
    var tname_mon_aft_t3 = preview.dataset.tname_mon_aft_t3;
    var tname_mon_aft_t4 = preview.dataset.tname_mon_aft_t4;

    var tname_tue_mor_t1 = preview.dataset.tname_tue_mor_t1;
    var tname_tue_mor_t2 = preview.dataset.tname_tue_mor_t2;
    var tname_tue_mor_t3 = preview.dataset.tname_tue_mor_t3;
    var tname_tue_mor_t4 = preview.dataset.tname_tue_mor_t4;
    var tname_tue_aft_t1 = preview.dataset.tname_tue_aft_t1;
    var tname_tue_aft_t2 = preview.dataset.tname_tue_aft_t2;
    var tname_tue_aft_t3 = preview.dataset.tname_tue_aft_t3;
    var tname_tue_aft_t4 = preview.dataset.tname_tue_aft_t4;

    var tname_wed_mor_t1 = preview.dataset.tname_wed_mor_t1;
    var tname_wed_mor_t2 = preview.dataset.tname_wed_mor_t2;
    var tname_wed_mor_t3 = preview.dataset.tname_wed_mor_t3;
    var tname_wed_mor_t4 = preview.dataset.tname_wed_mor_t4;
    var tname_wed_aft_t1 = preview.dataset.tname_wed_aft_t1;
    var tname_wed_aft_t2 = preview.dataset.tname_wed_aft_t2;
    var tname_wed_aft_t3 = preview.dataset.tname_wed_aft_t3;
    var tname_wed_aft_t4 = preview.dataset.tname_wed_aft_t4;

    var tname_thu_mor_t1 = preview.dataset.tname_thu_mor_t1;
    var tname_thu_mor_t2 = preview.dataset.tname_thu_mor_t2;
    var tname_thu_mor_t3 = preview.dataset.tname_thu_mor_t3;
    var tname_thu_mor_t4 = preview.dataset.tname_thu_mor_t4;
    var tname_thu_aft_t1 = preview.dataset.tname_thu_aft_t1;
    var tname_thu_aft_t2 = preview.dataset.tname_thu_aft_t2;
    var tname_thu_aft_t3 = preview.dataset.tname_thu_aft_t3;
    var tname_thu_aft_t4 = preview.dataset.tname_thu_aft_t4;

    var tname_fri_mor_t1 = preview.dataset.tname_fri_mor_t1;
    var tname_fri_mor_t2 = preview.dataset.tname_fri_mor_t2;
    var tname_fri_mor_t3 = preview.dataset.tname_fri_mor_t3;
    var tname_fri_mor_t4 = preview.dataset.tname_fri_mor_t4;
    var tname_fri_aft_t1 = preview.dataset.tname_fri_aft_t1;
    var tname_fri_aft_t2 = preview.dataset.tname_fri_aft_t2;
    var tname_fri_aft_t3 = preview.dataset.tname_fri_aft_t3;
    var tname_fri_aft_t4 = preview.dataset.tname_fri_aft_t4;


    let sub_mon_mor_kh_t1 = '';
    let sub_mon_mor_kh_t2 = '';
    let sub_mon_mor_kh_t3 = '';
    let sub_mon_mor_kh_t4 = '';
    let sub_mon_aft_kh_t1 = '';
    let sub_mon_aft_kh_t2 = '';
    let sub_mon_aft_kh_t3 = '';
    let sub_mon_aft_kh_t4 = '';

    let sub_tue_mor_kh_t1 = '';
    let sub_tue_mor_kh_t2 = '';
    let sub_tue_mor_kh_t3 = '';
    let sub_tue_mor_kh_t4 = '';
    let sub_tue_aft_kh_t1 = '';
    let sub_tue_aft_kh_t2 = '';
    let sub_tue_aft_kh_t3 = '';
    let sub_tue_aft_kh_t4 = '';

    let sub_wed_mor_kh_t1 = '';
    let sub_wed_mor_kh_t2 = '';
    let sub_wed_mor_kh_t3 = '';
    let sub_wed_mor_kh_t4 = '';
    let sub_wed_aft_kh_t1 = '';
    let sub_wed_aft_kh_t2 = '';
    let sub_wed_aft_kh_t3 = '';
    let sub_wed_aft_kh_t4 = '';

    let sub_thu_mor_kh_t1 = '';
    let sub_thu_mor_kh_t2 = '';
    let sub_thu_mor_kh_t3 = '';
    let sub_thu_mor_kh_t4 = '';
    let sub_thu_aft_kh_t1 = '';
    let sub_thu_aft_kh_t2 = '';
    let sub_thu_aft_kh_t3 = '';
    let sub_thu_aft_kh_t4 = '';

    let sub_fri_mor_kh_t1 = '';
    let sub_fri_mor_kh_t2 = '';
    let sub_fri_mor_kh_t3 = '';
    let sub_fri_mor_kh_t4 = '';
    let sub_fri_aft_kh_t1 = '';
    let sub_fri_aft_kh_t2 = '';
    let sub_fri_aft_kh_t3 = '';
    let sub_fri_aft_kh_t4 = '';

    if (sub_mon_mor_t1 == 'PE') { sub_mon_mor_kh_t1 = 'កីឡា' }
    if (sub_mon_mor_t1 == 'E') { sub_mon_mor_kh_t1 = 'អង់គ្លេស' }
    if (sub_mon_mor_t1 == 'ICT') { sub_mon_mor_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_mon_mor_t1 == 'M') { sub_mon_mor_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_mon_mor_t1 == 'C') { sub_mon_mor_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_mon_mor_t1 == 'Ho') { sub_mon_mor_kh_t1 = 'គេហៈ' }
    if (sub_mon_mor_t1 == 'Bio') { sub_mon_mor_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_mon_mor_t1 == 'H') { sub_mon_mor_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_mor_t1 == 'Es') { sub_mon_mor_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_mon_mor_t1 == 'G') { sub_mon_mor_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_mon_mor_t1 == 'P') { sub_mon_mor_kh_t1 = 'រូបវិទ្យា' }
    if (sub_mon_mor_t1 == 'Ac') { sub_mon_mor_kh_t1 = 'សកម្មភាព' }
    if (sub_mon_mor_t1 == 'Bi') { sub_mon_mor_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_mon_mor_t1 == 'Mo') { sub_mon_mor_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_mor_t1 == 'Eco') { sub_mon_mor_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_mor_t1 == 'K') { sub_mon_mor_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_mon_mor_t1 == 'Sci') { sub_mon_mor_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_mor_t1 == 'Soc') { sub_mon_mor_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_mon_mor_t1 == 'Di') { sub_mon_mor_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_mon_mor_t2 == 'PE') { sub_mon_mor_kh_t2 = 'កីឡា' }
    if (sub_mon_mor_t2 == 'E') { sub_mon_mor_kh_t2 = 'អង់គ្លេស' }
    if (sub_mon_mor_t2 == 'ICT') { sub_mon_mor_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_mon_mor_t2 == 'M') { sub_mon_mor_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_mon_mor_t2 == 'C') { sub_mon_mor_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_mon_mor_t2 == 'Ho') { sub_mon_mor_kh_t2 = 'គេហៈ' }
    if (sub_mon_mor_t2 == 'Bio') { sub_mon_mor_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_mon_mor_t2 == 'H') { sub_mon_mor_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_mor_t2 == 'Es') { sub_mon_mor_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_mon_mor_t2 == 'G') { sub_mon_mor_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_mon_mor_t2 == 'P') { sub_mon_mor_kh_t2 = 'រូបវិទ្យា' }
    if (sub_mon_mor_t2 == 'Ac') { sub_mon_mor_kh_t2 = 'សកម្មភាព' }
    if (sub_mon_mor_t2 == 'Bi') { sub_mon_mor_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_mon_mor_t2 == 'Mo') { sub_mon_mor_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_mor_t2 == 'Eco') { sub_mon_mor_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_mor_t2 == 'K') { sub_mon_mor_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_mon_mor_t2 == 'Sci') { sub_mon_mor_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_mor_t2 == 'Soc') { sub_mon_mor_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_mon_mor_t2 == 'Di') { sub_mon_mor_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_mon_mor_t3 == 'PE') { sub_mon_mor_kh_t3 = 'កីឡា' }
    if (sub_mon_mor_t3 == 'E') { sub_mon_mor_kh_t3 = 'អង់គ្លេស' }
    if (sub_mon_mor_t3 == 'ICT') { sub_mon_mor_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_mon_mor_t3 == 'M') { sub_mon_mor_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_mon_mor_t3 == 'C') { sub_mon_mor_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_mon_mor_t3 == 'Ho') { sub_mon_mor_kh_t3 = 'គេហៈ' }
    if (sub_mon_mor_t3 == 'Bio') { sub_mon_mor_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_mon_mor_t3 == 'H') { sub_mon_mor_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_mor_t3 == 'Es') { sub_mon_mor_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_mon_mor_t3 == 'G') { sub_mon_mor_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_mon_mor_t3 == 'P') { sub_mon_mor_kh_t3 = 'រូបវិទ្យា' }
    if (sub_mon_mor_t3 == 'Ac') { sub_mon_mor_kh_t3 = 'សកម្មភាព' }
    if (sub_mon_mor_t3 == 'Bi') { sub_mon_mor_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_mon_mor_t3 == 'Mo') { sub_mon_mor_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_mor_t3 == 'Eco') { sub_mon_mor_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_mor_t3 == 'K') { sub_mon_mor_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_mon_mor_t3 == 'Sci') { sub_mon_mor_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_mor_t3 == 'Soc') { sub_mon_mor_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_mon_mor_t3 == 'Di') { sub_mon_mor_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_mon_mor_t4 == 'PE') { sub_mon_mor_kh_t4 = 'កីឡា' }
    if (sub_mon_mor_t4 == 'E') { sub_mon_mor_kh_t4 = 'អង់គ្លេស' }
    if (sub_mon_mor_t4 == 'ICT') { sub_mon_mor_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_mon_mor_t4 == 'M') { sub_mon_mor_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_mon_mor_t4 == 'C') { sub_mon_mor_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_mon_mor_t4 == 'Ho') { sub_mon_mor_kh_t4 = 'គេហៈ' }
    if (sub_mon_mor_t4 == 'Bio') { sub_mon_mor_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_mon_mor_t4 == 'H') { sub_mon_mor_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_mor_t4 == 'Es') { sub_mon_mor_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_mon_mor_t4 == 'G') { sub_mon_mor_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_mon_mor_t4 == 'P') { sub_mon_mor_kh_t4 = 'រូបវិទ្យា' }
    if (sub_mon_mor_t4 == 'Ac') { sub_mon_mor_kh_t4 = 'សកម្មភាព' }
    if (sub_mon_mor_t4 == 'Bi') { sub_mon_mor_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_mon_mor_t4 == 'Mo') { sub_mon_mor_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_mor_t4 == 'Eco') { sub_mon_mor_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_mor_t4 == 'K') { sub_mon_mor_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_mon_mor_t4 == 'Sci') { sub_mon_mor_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_mor_t4 == 'Soc') { sub_mon_mor_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_mon_mor_t4 == 'Di') { sub_mon_mor_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_mon_aft_t1 == 'PE') { sub_mon_aft_kh_t1 = 'កីឡា' }
    if (sub_mon_aft_t1 == 'E') { sub_mon_aft_kh_t1 = 'អង់គ្លេស' }
    if (sub_mon_aft_t1 == 'ICT') { sub_mon_aft_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_mon_aft_t1 == 'M') { sub_mon_aft_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_mon_aft_t1 == 'C') { sub_mon_aft_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_mon_aft_t1 == 'Ho') { sub_mon_aft_kh_t1 = 'គេហៈ' }
    if (sub_mon_aft_t1 == 'Bio') { sub_mon_aft_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_mon_aft_t1 == 'H') { sub_mon_aft_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_aft_t1 == 'Es') { sub_mon_aft_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_mon_aft_t1 == 'G') { sub_mon_aft_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_mon_aft_t1 == 'P') { sub_mon_aft_kh_t1 = 'រូបវិទ្យា' }
    if (sub_mon_aft_t1 == 'Ac') { sub_mon_aft_kh_t1 = 'សកម្មភាព' }
    if (sub_mon_aft_t1 == 'Bi') { sub_mon_aft_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_mon_aft_t1 == 'Mo') { sub_mon_aft_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_aft_t1 == 'Eco') { sub_mon_aft_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_aft_t1 == 'K') { sub_mon_aft_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_mon_aft_t1 == 'Sci') { sub_mon_aft_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_aft_t1 == 'Soc') { sub_mon_aft_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_mon_aft_t1 == 'Di') { sub_mon_aft_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_mon_aft_t2 == 'PE') { sub_mon_aft_kh_t2 = 'កីឡា' }
    if (sub_mon_aft_t2 == 'E') { sub_mon_aft_kh_t2 = 'អង់គ្លេស' }
    if (sub_mon_aft_t2 == 'ICT') { sub_mon_aft_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_mon_aft_t2 == 'M') { sub_mon_aft_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_mon_aft_t2 == 'C') { sub_mon_aft_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_mon_aft_t2 == 'Ho') { sub_mon_aft_kh_t2 = 'គេហៈ' }
    if (sub_mon_aft_t2 == 'Bio') { sub_mon_aft_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_mon_aft_t2 == 'H') { sub_mon_aft_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_aft_t2 == 'Es') { sub_mon_aft_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_mon_aft_t2 == 'G') { sub_mon_aft_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_mon_aft_t2 == 'P') { sub_mon_aft_kh_t2 = 'រូបវិទ្យា' }
    if (sub_mon_aft_t2 == 'Ac') { sub_mon_aft_kh_t2 = 'សកម្មភាព' }
    if (sub_mon_aft_t2 == 'Bi') { sub_mon_aft_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_mon_aft_t2 == 'Mo') { sub_mon_aft_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_aft_t2 == 'Eco') { sub_mon_aft_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_aft_t2 == 'K') { sub_mon_aft_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_mon_aft_t2 == 'Sci') { sub_mon_aft_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_aft_t2 == 'Soc') { sub_mon_aft_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_mon_aft_t2 == 'Di') { sub_mon_aft_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_mon_aft_t3 == 'PE') { sub_mon_aft_kh_t3 = 'កីឡា' }
    if (sub_mon_aft_t3 == 'E') { sub_mon_aft_kh_t3 = 'អង់គ្លេស' }
    if (sub_mon_aft_t3 == 'ICT') { sub_mon_aft_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_mon_aft_t3 == 'M') { sub_mon_aft_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_mon_aft_t3 == 'C') { sub_mon_aft_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_mon_aft_t3 == 'Ho') { sub_mon_aft_kh_t3 = 'គេហៈ' }
    if (sub_mon_aft_t3 == 'Bio') { sub_mon_aft_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_mon_aft_t3 == 'H') { sub_mon_aft_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_aft_t3 == 'Es') { sub_mon_aft_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_mon_aft_t3 == 'G') { sub_mon_aft_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_mon_aft_t3 == 'P') { sub_mon_aft_kh_t3 = 'រូបវិទ្យា' }
    if (sub_mon_aft_t3 == 'Ac') { sub_mon_aft_kh_t3 = 'សកម្មភាព' }
    if (sub_mon_aft_t3 == 'Bi') { sub_mon_aft_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_mon_aft_t3 == 'Mo') { sub_mon_aft_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_aft_t3 == 'Eco') { sub_mon_aft_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_aft_t3 == 'K') { sub_mon_aft_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_mon_aft_t3 == 'Sci') { sub_mon_aft_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_aft_t3 == 'Soc') { sub_mon_aft_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_mon_aft_t3 == 'Di') { sub_mon_aft_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_mon_aft_t4 == 'PE') { sub_mon_aft_kh_t4 = 'កីឡា' }
    if (sub_mon_aft_t4 == 'E') { sub_mon_aft_kh_t4 = 'អង់គ្លេស' }
    if (sub_mon_aft_t4 == 'ICT') { sub_mon_aft_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_mon_aft_t4 == 'M') { sub_mon_aft_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_mon_aft_t4 == 'C') { sub_mon_aft_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_mon_aft_t4 == 'Ho') { sub_mon_aft_kh_t4 = 'គេហៈ' }
    if (sub_mon_aft_t4 == 'Bio') { sub_mon_aft_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_mon_aft_t4 == 'H') { sub_mon_aft_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_mon_aft_t4 == 'Es') { sub_mon_aft_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_mon_aft_t4 == 'G') { sub_mon_aft_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_mon_aft_t4 == 'P') { sub_mon_aft_kh_t4 = 'រូបវិទ្យា' }
    if (sub_mon_aft_t4 == 'Ac') { sub_mon_aft_kh_t4 = 'សកម្មភាព' }
    if (sub_mon_aft_t4 == 'Bi') { sub_mon_aft_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_mon_aft_t4 == 'Mo') { sub_mon_aft_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_mon_aft_t4 == 'Eco') { sub_mon_aft_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_mon_aft_t4 == 'K') { sub_mon_aft_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_mon_aft_t4 == 'Sci') { sub_mon_aft_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_mon_aft_t4 == 'Soc') { sub_mon_aft_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_mon_aft_t4 == 'Di') { sub_mon_aft_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_tue_mor_t1 == 'PE') { sub_tue_mor_kh_t1 = 'កីឡា' }
    if (sub_tue_mor_t1 == 'E') { sub_tue_mor_kh_t1 = 'អង់គ្លេស' }
    if (sub_tue_mor_t1 == 'ICT') { sub_tue_mor_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_tue_mor_t1 == 'M') { sub_tue_mor_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_tue_mor_t1 == 'C') { sub_tue_mor_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_tue_mor_t1 == 'Ho') { sub_tue_mor_kh_t1 = 'គេហៈ' }
    if (sub_tue_mor_t1 == 'Bio') { sub_tue_mor_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_tue_mor_t1 == 'H') { sub_tue_mor_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_mor_t1 == 'Es') { sub_tue_mor_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_tue_mor_t1 == 'G') { sub_tue_mor_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_tue_mor_t1 == 'P') { sub_tue_mor_kh_t1 = 'រូបវិទ្យា' }
    if (sub_tue_mor_t1 == 'Ac') { sub_tue_mor_kh_t1 = 'សកម្មភាព' }
    if (sub_tue_mor_t1 == 'Bi') { sub_tue_mor_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_tue_mor_t1 == 'Mo') { sub_tue_mor_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_mor_t1 == 'Eco') { sub_tue_mor_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_mor_t1 == 'K') { sub_tue_mor_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_tue_mor_t1 == 'Sci') { sub_tue_mor_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_mor_t1 == 'Soc') { sub_tue_mor_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_tue_mor_t1 == 'Di') { sub_tue_mor_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_tue_mor_t2 == 'PE') { sub_tue_mor_kh_t2 = 'កីឡា' }
    if (sub_tue_mor_t2 == 'E') { sub_tue_mor_kh_t2 = 'អង់គ្លេស' }
    if (sub_tue_mor_t2 == 'ICT') { sub_tue_mor_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_tue_mor_t2 == 'M') { sub_tue_mor_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_tue_mor_t2 == 'C') { sub_tue_mor_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_tue_mor_t2 == 'Ho') { sub_tue_mor_kh_t2 = 'គេហៈ' }
    if (sub_tue_mor_t2 == 'Bio') { sub_tue_mor_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_tue_mor_t2 == 'H') { sub_tue_mor_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_mor_t2 == 'Es') { sub_tue_mor_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_tue_mor_t2 == 'G') { sub_tue_mor_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_tue_mor_t2 == 'P') { sub_tue_mor_kh_t2 = 'រូបវិទ្យា' }
    if (sub_tue_mor_t2 == 'Ac') { sub_tue_mor_kh_t2 = 'សកម្មភាព' }
    if (sub_tue_mor_t2 == 'Bi') { sub_tue_mor_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_tue_mor_t2 == 'Mo') { sub_tue_mor_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_mor_t2 == 'Eco') { sub_tue_mor_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_mor_t2 == 'K') { sub_tue_mor_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_tue_mor_t2 == 'Sci') { sub_tue_mor_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_mor_t2 == 'Soc') { sub_tue_mor_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_tue_mor_t2 == 'Di') { sub_tue_mor_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_tue_mor_t3 == 'PE') { sub_tue_mor_kh_t3 = 'កីឡា' }
    if (sub_tue_mor_t3 == 'E') { sub_tue_mor_kh_t3 = 'អង់គ្លេស' }
    if (sub_tue_mor_t3 == 'ICT') { sub_tue_mor_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_tue_mor_t3 == 'M') { sub_tue_mor_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_tue_mor_t3 == 'C') { sub_tue_mor_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_tue_mor_t3 == 'Ho') { sub_tue_mor_kh_t3 = 'គេហៈ' }
    if (sub_tue_mor_t3 == 'Bio') { sub_tue_mor_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_tue_mor_t3 == 'H') { sub_tue_mor_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_mor_t3 == 'Es') { sub_tue_mor_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_tue_mor_t3 == 'G') { sub_tue_mor_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_tue_mor_t3 == 'P') { sub_tue_mor_kh_t3 = 'រូបវិទ្យា' }
    if (sub_tue_mor_t3 == 'Ac') { sub_tue_mor_kh_t3 = 'សកម្មភាព' }
    if (sub_tue_mor_t3 == 'Bi') { sub_tue_mor_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_tue_mor_t3 == 'Mo') { sub_tue_mor_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_mor_t3 == 'Eco') { sub_tue_mor_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_mor_t3 == 'K') { sub_tue_mor_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_tue_mor_t3 == 'Sci') { sub_tue_mor_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_mor_t3 == 'Soc') { sub_tue_mor_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_tue_mor_t3 == 'Di') { sub_tue_mor_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_tue_mor_t4 == 'PE') { sub_tue_mor_kh_t4 = 'កីឡា' }
    if (sub_tue_mor_t4 == 'E') { sub_tue_mor_kh_t4 = 'អង់គ្លេស' }
    if (sub_tue_mor_t4 == 'ICT') { sub_tue_mor_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_tue_mor_t4 == 'M') { sub_tue_mor_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_tue_mor_t4 == 'C') { sub_tue_mor_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_tue_mor_t4 == 'Ho') { sub_tue_mor_kh_t4 = 'គេហៈ' }
    if (sub_tue_mor_t4 == 'Bio') { sub_tue_mor_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_tue_mor_t4 == 'H') { sub_tue_mor_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_mor_t4 == 'Es') { sub_tue_mor_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_tue_mor_t4 == 'G') { sub_tue_mor_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_tue_mor_t4 == 'P') { sub_tue_mor_kh_t4 = 'រូបវិទ្យា' }
    if (sub_tue_mor_t4 == 'Ac') { sub_tue_mor_kh_t4 = 'សកម្មភាព' }
    if (sub_tue_mor_t4 == 'Bi') { sub_tue_mor_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_tue_mor_t4 == 'Mo') { sub_tue_mor_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_mor_t4 == 'Eco') { sub_tue_mor_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_mor_t4 == 'K') { sub_tue_mor_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_tue_mor_t4 == 'Sci') { sub_tue_mor_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_mor_t4 == 'Soc') { sub_tue_mor_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_tue_mor_t4 == 'Di') { sub_tue_mor_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_tue_aft_t1 == 'PE') { sub_tue_aft_kh_t1 = 'កីឡា' }
    if (sub_tue_aft_t1 == 'E') { sub_tue_aft_kh_t1 = 'អង់គ្លេស' }
    if (sub_tue_aft_t1 == 'ICT') { sub_tue_aft_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_tue_aft_t1 == 'M') { sub_tue_aft_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_tue_aft_t1 == 'C') { sub_tue_aft_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_tue_aft_t1 == 'Ho') { sub_tue_aft_kh_t1 = 'គេហៈ' }
    if (sub_tue_aft_t1 == 'Bio') { sub_tue_aft_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_tue_aft_t1 == 'H') { sub_tue_aft_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_aft_t1 == 'Es') { sub_tue_aft_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_tue_aft_t1 == 'G') { sub_tue_aft_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_tue_aft_t1 == 'P') { sub_tue_aft_kh_t1 = 'រូបវិទ្យា' }
    if (sub_tue_aft_t1 == 'Ac') { sub_tue_aft_kh_t1 = 'សកម្មភាព' }
    if (sub_tue_aft_t1 == 'Bi') { sub_tue_aft_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_tue_aft_t1 == 'Mo') { sub_tue_aft_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_aft_t1 == 'Eco') { sub_tue_aft_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_aft_t1 == 'K') { sub_tue_aft_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_tue_aft_t1 == 'Sci') { sub_tue_aft_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_aft_t1 == 'Soc') { sub_tue_aft_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_tue_aft_t1 == 'Di') { sub_tue_aft_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_tue_aft_t2 == 'PE') { sub_tue_aft_kh_t2 = 'កីឡា' }
    if (sub_tue_aft_t2 == 'E') { sub_tue_aft_kh_t2 = 'អង់គ្លេស' }
    if (sub_tue_aft_t2 == 'ICT') { sub_tue_aft_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_tue_aft_t2 == 'M') { sub_tue_aft_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_tue_aft_t2 == 'C') { sub_tue_aft_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_tue_aft_t2 == 'Ho') { sub_tue_aft_kh_t2 = 'គេហៈ' }
    if (sub_tue_aft_t2 == 'Bio') { sub_tue_aft_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_tue_aft_t2 == 'H') { sub_tue_aft_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_aft_t2 == 'Es') { sub_tue_aft_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_tue_aft_t2 == 'G') { sub_tue_aft_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_tue_aft_t2 == 'P') { sub_tue_aft_kh_t2 = 'រូបវិទ្យា' }
    if (sub_tue_aft_t2 == 'Ac') { sub_tue_aft_kh_t2 = 'សកម្មភាព' }
    if (sub_tue_aft_t2 == 'Bi') { sub_tue_aft_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_tue_aft_t2 == 'Mo') { sub_tue_aft_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_aft_t2 == 'Eco') { sub_tue_aft_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_aft_t2 == 'K') { sub_tue_aft_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_tue_aft_t2 == 'Sci') { sub_tue_aft_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_aft_t2 == 'Soc') { sub_tue_aft_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_tue_aft_t2 == 'Di') { sub_tue_aft_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_tue_aft_t3 == 'PE') { sub_tue_aft_kh_t3 = 'កីឡា' }
    if (sub_tue_aft_t3 == 'E') { sub_tue_aft_kh_t3 = 'អង់គ្លេស' }
    if (sub_tue_aft_t3 == 'ICT') { sub_tue_aft_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_tue_aft_t3 == 'M') { sub_tue_aft_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_tue_aft_t3 == 'C') { sub_tue_aft_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_tue_aft_t3 == 'Ho') { sub_tue_aft_kh_t3 = 'គេហៈ' }
    if (sub_tue_aft_t3 == 'Bio') { sub_tue_aft_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_tue_aft_t3 == 'H') { sub_tue_aft_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_aft_t3 == 'Es') { sub_tue_aft_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_tue_aft_t3 == 'G') { sub_tue_aft_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_tue_aft_t3 == 'P') { sub_tue_aft_kh_t3 = 'រូបវិទ្យា' }
    if (sub_tue_aft_t3 == 'Ac') { sub_tue_aft_kh_t3 = 'សកម្មភាព' }
    if (sub_tue_aft_t3 == 'Bi') { sub_tue_aft_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_tue_aft_t3 == 'Mo') { sub_tue_aft_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_aft_t3 == 'Eco') { sub_tue_aft_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_aft_t3 == 'K') { sub_tue_aft_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_tue_aft_t3 == 'Sci') { sub_tue_aft_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_aft_t3 == 'Soc') { sub_tue_aft_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_tue_aft_t3 == 'Di') { sub_tue_aft_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_tue_aft_t4 == 'PE') { sub_tue_aft_kh_t4 = 'កីឡា' }
    if (sub_tue_aft_t4 == 'E') { sub_tue_aft_kh_t4 = 'អង់គ្លេស' }
    if (sub_tue_aft_t4 == 'ICT') { sub_tue_aft_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_tue_aft_t4 == 'M') { sub_tue_aft_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_tue_aft_t4 == 'C') { sub_tue_aft_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_tue_aft_t4 == 'Ho') { sub_tue_aft_kh_t4 = 'គេហៈ' }
    if (sub_tue_aft_t4 == 'Bio') { sub_tue_aft_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_tue_aft_t4 == 'H') { sub_tue_aft_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_tue_aft_t4 == 'Es') { sub_tue_aft_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_tue_aft_t4 == 'G') { sub_tue_aft_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_tue_aft_t4 == 'P') { sub_tue_aft_kh_t4 = 'រូបវិទ្យា' }
    if (sub_tue_aft_t4 == 'Ac') { sub_tue_aft_kh_t4 = 'សកម្មភាព' }
    if (sub_tue_aft_t4 == 'Bi') { sub_tue_aft_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_tue_aft_t4 == 'Mo') { sub_tue_aft_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_tue_aft_t4 == 'Eco') { sub_tue_aft_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_tue_aft_t4 == 'K') { sub_tue_aft_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_tue_aft_t4 == 'Sci') { sub_tue_aft_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_tue_aft_t4 == 'Soc') { sub_tue_aft_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_tue_aft_t4 == 'Di') { sub_tue_aft_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_wed_mor_t1 == 'PE') { sub_wed_mor_kh_t1 = 'កីឡា' }
    if (sub_wed_mor_t1 == 'E') { sub_wed_mor_kh_t1 = 'អង់គ្លេស' }
    if (sub_wed_mor_t1 == 'ICT') { sub_wed_mor_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_wed_mor_t1 == 'M') { sub_wed_mor_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_wed_mor_t1 == 'C') { sub_wed_mor_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_wed_mor_t1 == 'Ho') { sub_wed_mor_kh_t1 = 'គេហៈ' }
    if (sub_wed_mor_t1 == 'Bio') { sub_wed_mor_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_wed_mor_t1 == 'H') { sub_wed_mor_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_mor_t1 == 'Es') { sub_wed_mor_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_wed_mor_t1 == 'G') { sub_wed_mor_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_wed_mor_t1 == 'P') { sub_wed_mor_kh_t1 = 'រូបវិទ្យា' }
    if (sub_wed_mor_t1 == 'Ac') { sub_wed_mor_kh_t1 = 'សកម្មភាព' }
    if (sub_wed_mor_t1 == 'Bi') { sub_wed_mor_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_wed_mor_t1 == 'Mo') { sub_wed_mor_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_mor_t1 == 'Eco') { sub_wed_mor_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_mor_t1 == 'K') { sub_wed_mor_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_wed_mor_t1 == 'Sci') { sub_wed_mor_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_mor_t1 == 'Soc') { sub_wed_mor_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_wed_mor_t1 == 'Di') { sub_wed_mor_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_wed_mor_t2 == 'PE') { sub_wed_mor_kh_t2 = 'កីឡា' }
    if (sub_wed_mor_t2 == 'E') { sub_wed_mor_kh_t2 = 'អង់គ្លេស' }
    if (sub_wed_mor_t2 == 'ICT') { sub_wed_mor_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_wed_mor_t2 == 'M') { sub_wed_mor_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_wed_mor_t2 == 'C') { sub_wed_mor_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_wed_mor_t2 == 'Ho') { sub_wed_mor_kh_t2 = 'គេហៈ' }
    if (sub_wed_mor_t2 == 'Bio') { sub_wed_mor_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_wed_mor_t2 == 'H') { sub_wed_mor_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_mor_t2 == 'Es') { sub_wed_mor_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_wed_mor_t2 == 'G') { sub_wed_mor_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_wed_mor_t2 == 'P') { sub_wed_mor_kh_t2 = 'រូបវិទ្យា' }
    if (sub_wed_mor_t2 == 'Ac') { sub_wed_mor_kh_t2 = 'សកម្មភាព' }
    if (sub_wed_mor_t2 == 'Bi') { sub_wed_mor_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_wed_mor_t2 == 'Mo') { sub_wed_mor_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_mor_t2 == 'Eco') { sub_wed_mor_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_mor_t2 == 'K') { sub_wed_mor_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_wed_mor_t2 == 'Sci') { sub_wed_mor_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_mor_t2 == 'Soc') { sub_wed_mor_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_wed_mor_t2 == 'Di') { sub_wed_mor_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_wed_mor_t3 == 'PE') { sub_wed_mor_kh_t3 = 'កីឡា' }
    if (sub_wed_mor_t3 == 'E') { sub_wed_mor_kh_t3 = 'អង់គ្លេស' }
    if (sub_wed_mor_t3 == 'ICT') { sub_wed_mor_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_wed_mor_t3 == 'M') { sub_wed_mor_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_wed_mor_t3 == 'C') { sub_wed_mor_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_wed_mor_t3 == 'Ho') { sub_wed_mor_kh_t3 = 'គេហៈ' }
    if (sub_wed_mor_t3 == 'Bio') { sub_wed_mor_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_wed_mor_t3 == 'H') { sub_wed_mor_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_mor_t3 == 'Es') { sub_wed_mor_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_wed_mor_t3 == 'G') { sub_wed_mor_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_wed_mor_t3 == 'P') { sub_wed_mor_kh_t3 = 'រូបវិទ្យា' }
    if (sub_wed_mor_t3 == 'Ac') { sub_wed_mor_kh_t3 = 'សកម្មភាព' }
    if (sub_wed_mor_t3 == 'Bi') { sub_wed_mor_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_wed_mor_t3 == 'Mo') { sub_wed_mor_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_mor_t3 == 'Eco') { sub_wed_mor_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_mor_t3 == 'K') { sub_wed_mor_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_wed_mor_t3 == 'Sci') { sub_wed_mor_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_mor_t3 == 'Soc') { sub_wed_mor_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_wed_mor_t3 == 'Di') { sub_wed_mor_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_wed_mor_t4 == 'PE') { sub_wed_mor_kh_t4 = 'កីឡា' }
    if (sub_wed_mor_t4 == 'E') { sub_wed_mor_kh_t4 = 'អង់គ្លេស' }
    if (sub_wed_mor_t4 == 'ICT') { sub_wed_mor_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_wed_mor_t4 == 'M') { sub_wed_mor_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_wed_mor_t4 == 'C') { sub_wed_mor_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_wed_mor_t4 == 'Ho') { sub_wed_mor_kh_t4 = 'គេហៈ' }
    if (sub_wed_mor_t4 == 'Bio') { sub_wed_mor_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_wed_mor_t4 == 'H') { sub_wed_mor_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_mor_t4 == 'Es') { sub_wed_mor_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_wed_mor_t4 == 'G') { sub_wed_mor_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_wed_mor_t4 == 'P') { sub_wed_mor_kh_t4 = 'រូបវិទ្យា' }
    if (sub_wed_mor_t4 == 'Ac') { sub_wed_mor_kh_t4 = 'សកម្មភាព' }
    if (sub_wed_mor_t4 == 'Bi') { sub_wed_mor_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_wed_mor_t4 == 'Mo') { sub_wed_mor_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_mor_t4 == 'Eco') { sub_wed_mor_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_mor_t4 == 'K') { sub_wed_mor_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_wed_mor_t4 == 'Sci') { sub_wed_mor_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_mor_t4 == 'Soc') { sub_wed_mor_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_wed_mor_t4 == 'Di') { sub_wed_mor_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_wed_aft_t1 == 'PE') { sub_wed_aft_kh_t1 = 'កីឡា' }
    if (sub_wed_aft_t1 == 'E') { sub_wed_aft_kh_t1 = 'អង់គ្លេស' }
    if (sub_wed_aft_t1 == 'ICT') { sub_wed_aft_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_wed_aft_t1 == 'M') { sub_wed_aft_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_wed_aft_t1 == 'C') { sub_wed_aft_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_wed_aft_t1 == 'Ho') { sub_wed_aft_kh_t1 = 'គេហៈ' }
    if (sub_wed_aft_t1 == 'Bio') { sub_wed_aft_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_wed_aft_t1 == 'H') { sub_wed_aft_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_aft_t1 == 'Es') { sub_wed_aft_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_wed_aft_t1 == 'G') { sub_wed_aft_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_wed_aft_t1 == 'P') { sub_wed_aft_kh_t1 = 'រូបវិទ្យា' }
    if (sub_wed_aft_t1 == 'Ac') { sub_wed_aft_kh_t1 = 'សកម្មភាព' }
    if (sub_wed_aft_t1 == 'Bi') { sub_wed_aft_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_wed_aft_t1 == 'Mo') { sub_wed_aft_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_aft_t1 == 'Eco') { sub_wed_aft_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_aft_t1 == 'K') { sub_wed_aft_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_wed_aft_t1 == 'Sci') { sub_wed_aft_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_aft_t1 == 'Soc') { sub_wed_aft_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_wed_aft_t1 == 'Di') { sub_wed_aft_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_wed_aft_t2 == 'PE') { sub_wed_aft_kh_t2 = 'កីឡា' }
    if (sub_wed_aft_t2 == 'E') { sub_wed_aft_kh_t2 = 'អង់គ្លេស' }
    if (sub_wed_aft_t2 == 'ICT') { sub_wed_aft_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_wed_aft_t2 == 'M') { sub_wed_aft_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_wed_aft_t2 == 'C') { sub_wed_aft_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_wed_aft_t2 == 'Ho') { sub_wed_aft_kh_t2 = 'គេហៈ' }
    if (sub_wed_aft_t2 == 'Bio') { sub_wed_aft_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_wed_aft_t2 == 'H') { sub_wed_aft_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_aft_t2 == 'Es') { sub_wed_aft_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_wed_aft_t2 == 'G') { sub_wed_aft_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_wed_aft_t2 == 'P') { sub_wed_aft_kh_t2 = 'រូបវិទ្យា' }
    if (sub_wed_aft_t2 == 'Ac') { sub_wed_aft_kh_t2 = 'សកម្មភាព' }
    if (sub_wed_aft_t2 == 'Bi') { sub_wed_aft_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_wed_aft_t2 == 'Mo') { sub_wed_aft_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_aft_t2 == 'Eco') { sub_wed_aft_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_aft_t2 == 'K') { sub_wed_aft_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_wed_aft_t2 == 'Sci') { sub_wed_aft_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_aft_t2 == 'Soc') { sub_wed_aft_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_wed_aft_t2 == 'Di') { sub_wed_aft_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_wed_aft_t3 == 'PE') { sub_wed_aft_kh_t3 = 'កីឡា' }
    if (sub_wed_aft_t3 == 'E') { sub_wed_aft_kh_t3 = 'អង់គ្លេស' }
    if (sub_wed_aft_t3 == 'ICT') { sub_wed_aft_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_wed_aft_t3 == 'M') { sub_wed_aft_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_wed_aft_t3 == 'C') { sub_wed_aft_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_wed_aft_t3 == 'Ho') { sub_wed_aft_kh_t3 = 'គេហៈ' }
    if (sub_wed_aft_t3 == 'Bio') { sub_wed_aft_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_wed_aft_t3 == 'H') { sub_wed_aft_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_aft_t3 == 'Es') { sub_wed_aft_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_wed_aft_t3 == 'G') { sub_wed_aft_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_wed_aft_t3 == 'P') { sub_wed_aft_kh_t3 = 'រូបវិទ្យា' }
    if (sub_wed_aft_t3 == 'Ac') { sub_wed_aft_kh_t3 = 'សកម្មភាព' }
    if (sub_wed_aft_t3 == 'Bi') { sub_wed_aft_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_wed_aft_t3 == 'Mo') { sub_wed_aft_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_aft_t3 == 'Eco') { sub_wed_aft_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_aft_t3 == 'K') { sub_wed_aft_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_wed_aft_t3 == 'Sci') { sub_wed_aft_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_aft_t3 == 'Soc') { sub_wed_aft_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_wed_aft_t3 == 'Di') { sub_wed_aft_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_wed_aft_t4 == 'PE') { sub_wed_aft_kh_t4 = 'កីឡា' }
    if (sub_wed_aft_t4 == 'E') { sub_wed_aft_kh_t4 = 'អង់គ្លេស' }
    if (sub_wed_aft_t4 == 'ICT') { sub_wed_aft_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_wed_aft_t4 == 'M') { sub_wed_aft_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_wed_aft_t4 == 'C') { sub_wed_aft_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_wed_aft_t4 == 'Ho') { sub_wed_aft_kh_t4 = 'គេហៈ' }
    if (sub_wed_aft_t4 == 'Bio') { sub_wed_aft_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_wed_aft_t4 == 'H') { sub_wed_aft_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_wed_aft_t4 == 'Es') { sub_wed_aft_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_wed_aft_t4 == 'G') { sub_wed_aft_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_wed_aft_t4 == 'P') { sub_wed_aft_kh_t4 = 'រូបវិទ្យា' }
    if (sub_wed_aft_t4 == 'Ac') { sub_wed_aft_kh_t4 = 'សកម្មភាព' }
    if (sub_wed_aft_t4 == 'Bi') { sub_wed_aft_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_wed_aft_t4 == 'Mo') { sub_wed_aft_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_wed_aft_t4 == 'Eco') { sub_wed_aft_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_wed_aft_t4 == 'K') { sub_wed_aft_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_wed_aft_t4 == 'Sci') { sub_wed_aft_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_wed_aft_t4 == 'Soc') { sub_wed_aft_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_wed_aft_t4 == 'Di') { sub_wed_aft_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_thu_mor_t1 == 'PE') { sub_thu_mor_kh_t1 = 'កីឡា' }
    if (sub_thu_mor_t1 == 'E') { sub_thu_mor_kh_t1 = 'អង់គ្លេស' }
    if (sub_thu_mor_t1 == 'ICT') { sub_thu_mor_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_thu_mor_t1 == 'M') { sub_thu_mor_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_thu_mor_t1 == 'C') { sub_thu_mor_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_thu_mor_t1 == 'Ho') { sub_thu_mor_kh_t1 = 'គេហៈ' }
    if (sub_thu_mor_t1 == 'Bio') { sub_thu_mor_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_thu_mor_t1 == 'H') { sub_thu_mor_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_mor_t1 == 'Es') { sub_thu_mor_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_thu_mor_t1 == 'G') { sub_thu_mor_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_thu_mor_t1 == 'P') { sub_thu_mor_kh_t1 = 'រូបវិទ្យា' }
    if (sub_thu_mor_t1 == 'Ac') { sub_thu_mor_kh_t1 = 'សកម្មភាព' }
    if (sub_thu_mor_t1 == 'Bi') { sub_thu_mor_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_thu_mor_t1 == 'Mo') { sub_thu_mor_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_mor_t1 == 'Eco') { sub_thu_mor_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_mor_t1 == 'K') { sub_thu_mor_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_thu_mor_t1 == 'Sci') { sub_thu_mor_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_mor_t1 == 'Soc') { sub_thu_mor_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_thu_mor_t1 == 'Di') { sub_thu_mor_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_thu_mor_t2 == 'PE') { sub_thu_mor_kh_t2 = 'កីឡា' }
    if (sub_thu_mor_t2 == 'E') { sub_thu_mor_kh_t2 = 'អង់គ្លេស' }
    if (sub_thu_mor_t2 == 'ICT') { sub_thu_mor_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_thu_mor_t2 == 'M') { sub_thu_mor_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_thu_mor_t2 == 'C') { sub_thu_mor_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_thu_mor_t2 == 'Ho') { sub_thu_mor_kh_t2 = 'គេហៈ' }
    if (sub_thu_mor_t2 == 'Bio') { sub_thu_mor_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_thu_mor_t2 == 'H') { sub_thu_mor_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_mor_t2 == 'Es') { sub_thu_mor_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_thu_mor_t2 == 'G') { sub_thu_mor_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_thu_mor_t2 == 'P') { sub_thu_mor_kh_t2 = 'រូបវិទ្យា' }
    if (sub_thu_mor_t2 == 'Ac') { sub_thu_mor_kh_t2 = 'សកម្មភាព' }
    if (sub_thu_mor_t2 == 'Bi') { sub_thu_mor_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_thu_mor_t2 == 'Mo') { sub_thu_mor_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_mor_t2 == 'Eco') { sub_thu_mor_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_mor_t2 == 'K') { sub_thu_mor_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_thu_mor_t2 == 'Sci') { sub_thu_mor_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_mor_t2 == 'Soc') { sub_thu_mor_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_thu_mor_t2 == 'Di') { sub_thu_mor_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_thu_mor_t3 == 'PE') { sub_thu_mor_kh_t3 = 'កីឡា' }
    if (sub_thu_mor_t3 == 'E') { sub_thu_mor_kh_t3 = 'អង់គ្លេស' }
    if (sub_thu_mor_t3 == 'ICT') { sub_thu_mor_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_thu_mor_t3 == 'M') { sub_thu_mor_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_thu_mor_t3 == 'C') { sub_thu_mor_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_thu_mor_t3 == 'Ho') { sub_thu_mor_kh_t3 = 'គេហៈ' }
    if (sub_thu_mor_t3 == 'Bio') { sub_thu_mor_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_thu_mor_t3 == 'H') { sub_thu_mor_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_mor_t3 == 'Es') { sub_thu_mor_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_thu_mor_t3 == 'G') { sub_thu_mor_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_thu_mor_t3 == 'P') { sub_thu_mor_kh_t3 = 'រូបវិទ្យា' }
    if (sub_thu_mor_t3 == 'Ac') { sub_thu_mor_kh_t3 = 'សកម្មភាព' }
    if (sub_thu_mor_t3 == 'Bi') { sub_thu_mor_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_thu_mor_t3 == 'Mo') { sub_thu_mor_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_mor_t3 == 'Eco') { sub_thu_mor_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_mor_t3 == 'K') { sub_thu_mor_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_thu_mor_t3 == 'Sci') { sub_thu_mor_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_mor_t3 == 'Soc') { sub_thu_mor_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_thu_mor_t3 == 'Di') { sub_thu_mor_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_thu_mor_t4 == 'PE') { sub_thu_mor_kh_t4 = 'កីឡា' }
    if (sub_thu_mor_t4 == 'E') { sub_thu_mor_kh_t4 = 'អង់គ្លេស' }
    if (sub_thu_mor_t4 == 'ICT') { sub_thu_mor_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_thu_mor_t4 == 'M') { sub_thu_mor_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_thu_mor_t4 == 'C') { sub_thu_mor_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_thu_mor_t4 == 'Ho') { sub_thu_mor_kh_t4 = 'គេហៈ' }
    if (sub_thu_mor_t4 == 'Bio') { sub_thu_mor_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_thu_mor_t4 == 'H') { sub_thu_mor_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_mor_t4 == 'Es') { sub_thu_mor_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_thu_mor_t4 == 'G') { sub_thu_mor_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_thu_mor_t4 == 'P') { sub_thu_mor_kh_t4 = 'រូបវិទ្យា' }
    if (sub_thu_mor_t4 == 'Ac') { sub_thu_mor_kh_t4 = 'សកម្មភាព' }
    if (sub_thu_mor_t4 == 'Bi') { sub_thu_mor_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_thu_mor_t4 == 'Mo') { sub_thu_mor_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_mor_t4 == 'Eco') { sub_thu_mor_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_mor_t4 == 'K') { sub_thu_mor_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_thu_mor_t4 == 'Sci') { sub_thu_mor_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_mor_t4 == 'Soc') { sub_thu_mor_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_thu_mor_t4 == 'Di') { sub_thu_mor_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_thu_aft_t1 == 'PE') { sub_thu_aft_kh_t1 = 'កីឡា' }
    if (sub_thu_aft_t1 == 'E') { sub_thu_aft_kh_t1 = 'អង់គ្លេស' }
    if (sub_thu_aft_t1 == 'ICT') { sub_thu_aft_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_thu_aft_t1 == 'M') { sub_thu_aft_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_thu_aft_t1 == 'C') { sub_thu_aft_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_thu_aft_t1 == 'Ho') { sub_thu_aft_kh_t1 = 'គេហៈ' }
    if (sub_thu_aft_t1 == 'Bio') { sub_thu_aft_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_thu_aft_t1 == 'H') { sub_thu_aft_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_aft_t1 == 'Es') { sub_thu_aft_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_thu_aft_t1 == 'G') { sub_thu_aft_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_thu_aft_t1 == 'P') { sub_thu_aft_kh_t1 = 'រូបវិទ្យា' }
    if (sub_thu_aft_t1 == 'Ac') { sub_thu_aft_kh_t1 = 'សកម្មភាព' }
    if (sub_thu_aft_t1 == 'Bi') { sub_thu_aft_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_thu_aft_t1 == 'Mo') { sub_thu_aft_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_aft_t1 == 'Eco') { sub_thu_aft_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_aft_t1 == 'K') { sub_thu_aft_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_thu_aft_t1 == 'Sci') { sub_thu_aft_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_aft_t1 == 'Soc') { sub_thu_aft_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_thu_aft_t1 == 'Di') { sub_thu_aft_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_thu_aft_t2 == 'PE') { sub_thu_aft_kh_t2 = 'កីឡា' }
    if (sub_thu_aft_t2 == 'E') { sub_thu_aft_kh_t2 = 'អង់គ្លេស' }
    if (sub_thu_aft_t2 == 'ICT') { sub_thu_aft_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_thu_aft_t2 == 'M') { sub_thu_aft_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_thu_aft_t2 == 'C') { sub_thu_aft_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_thu_aft_t2 == 'Ho') { sub_thu_aft_kh_t2 = 'គេហៈ' }
    if (sub_thu_aft_t2 == 'Bio') { sub_thu_aft_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_thu_aft_t2 == 'H') { sub_thu_aft_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_aft_t2 == 'Es') { sub_thu_aft_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_thu_aft_t2 == 'G') { sub_thu_aft_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_thu_aft_t2 == 'P') { sub_thu_aft_kh_t2 = 'រូបវិទ្យា' }
    if (sub_thu_aft_t2 == 'Ac') { sub_thu_aft_kh_t2 = 'សកម្មភាព' }
    if (sub_thu_aft_t2 == 'Bi') { sub_thu_aft_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_thu_aft_t2 == 'Mo') { sub_thu_aft_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_aft_t2 == 'Eco') { sub_thu_aft_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_aft_t2 == 'K') { sub_thu_aft_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_thu_aft_t2 == 'Sci') { sub_thu_aft_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_aft_t2 == 'Soc') { sub_thu_aft_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_thu_aft_t2 == 'Di') { sub_thu_aft_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_thu_aft_t3 == 'PE') { sub_thu_aft_kh_t3 = 'កីឡា' }
    if (sub_thu_aft_t3 == 'E') { sub_thu_aft_kh_t3 = 'អង់គ្លេស' }
    if (sub_thu_aft_t3 == 'ICT') { sub_thu_aft_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_thu_aft_t3 == 'M') { sub_thu_aft_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_thu_aft_t3 == 'C') { sub_thu_aft_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_thu_aft_t3 == 'Ho') { sub_thu_aft_kh_t3 = 'គេហៈ' }
    if (sub_thu_aft_t3 == 'Bio') { sub_thu_aft_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_thu_aft_t3 == 'H') { sub_thu_aft_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_aft_t3 == 'Es') { sub_thu_aft_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_thu_aft_t3 == 'G') { sub_thu_aft_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_thu_aft_t3 == 'P') { sub_thu_aft_kh_t3 = 'រូបវិទ្យា' }
    if (sub_thu_aft_t3 == 'Ac') { sub_thu_aft_kh_t3 = 'សកម្មភាព' }
    if (sub_thu_aft_t3 == 'Bi') { sub_thu_aft_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_thu_aft_t3 == 'Mo') { sub_thu_aft_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_aft_t3 == 'Eco') { sub_thu_aft_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_aft_t3 == 'K') { sub_thu_aft_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_thu_aft_t3 == 'Sci') { sub_thu_aft_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_aft_t3 == 'Soc') { sub_thu_aft_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_thu_aft_t3 == 'Di') { sub_thu_aft_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_thu_aft_t4 == 'PE') { sub_thu_aft_kh_t4 = 'កីឡា' }
    if (sub_thu_aft_t4 == 'E') { sub_thu_aft_kh_t4 = 'អង់គ្លេស' }
    if (sub_thu_aft_t4 == 'ICT') { sub_thu_aft_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_thu_aft_t4 == 'M') { sub_thu_aft_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_thu_aft_t4 == 'C') { sub_thu_aft_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_thu_aft_t4 == 'Ho') { sub_thu_aft_kh_t4 = 'គេហៈ' }
    if (sub_thu_aft_t4 == 'Bio') { sub_thu_aft_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_thu_aft_t4 == 'H') { sub_thu_aft_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_thu_aft_t4 == 'Es') { sub_thu_aft_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_thu_aft_t4 == 'G') { sub_thu_aft_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_thu_aft_t4 == 'P') { sub_thu_aft_kh_t4 = 'រូបវិទ្យា' }
    if (sub_thu_aft_t4 == 'Ac') { sub_thu_aft_kh_t4 = 'សកម្មភាព' }
    if (sub_thu_aft_t4 == 'Bi') { sub_thu_aft_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_thu_aft_t4 == 'Mo') { sub_thu_aft_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_thu_aft_t4 == 'Eco') { sub_thu_aft_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_thu_aft_t4 == 'K') { sub_thu_aft_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_thu_aft_t4 == 'Sci') { sub_thu_aft_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_thu_aft_t4 == 'Soc') { sub_thu_aft_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_thu_aft_t4 == 'Di') { sub_thu_aft_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_fri_mor_t1 == 'PE') { sub_fri_mor_kh_t1 = 'កីឡា' }
    if (sub_fri_mor_t1 == 'E') { sub_fri_mor_kh_t1 = 'អង់គ្លេស' }
    if (sub_fri_mor_t1 == 'ICT') { sub_fri_mor_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_fri_mor_t1 == 'M') { sub_fri_mor_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_fri_mor_t1 == 'C') { sub_fri_mor_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_fri_mor_t1 == 'Ho') { sub_fri_mor_kh_t1 = 'គេហៈ' }
    if (sub_fri_mor_t1 == 'Bio') { sub_fri_mor_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_fri_mor_t1 == 'H') { sub_fri_mor_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_mor_t1 == 'Es') { sub_fri_mor_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_fri_mor_t1 == 'G') { sub_fri_mor_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_fri_mor_t1 == 'P') { sub_fri_mor_kh_t1 = 'រូបវិទ្យា' }
    if (sub_fri_mor_t1 == 'Ac') { sub_fri_mor_kh_t1 = 'សកម្មភាព' }
    if (sub_fri_mor_t1 == 'Bi') { sub_fri_mor_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_fri_mor_t1 == 'Mo') { sub_fri_mor_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_mor_t1 == 'Eco') { sub_fri_mor_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_mor_t1 == 'K') { sub_fri_mor_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_fri_mor_t1 == 'Sci') { sub_fri_mor_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_mor_t1 == 'Soc') { sub_fri_mor_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_fri_mor_t1 == 'Di') { sub_fri_mor_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_fri_mor_t2 == 'PE') { sub_fri_mor_kh_t2 = 'កីឡា' }
    if (sub_fri_mor_t2 == 'E') { sub_fri_mor_kh_t2 = 'អង់គ្លេស' }
    if (sub_fri_mor_t2 == 'ICT') { sub_fri_mor_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_fri_mor_t2 == 'M') { sub_fri_mor_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_fri_mor_t2 == 'C') { sub_fri_mor_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_fri_mor_t2 == 'Ho') { sub_fri_mor_kh_t2 = 'គេហៈ' }
    if (sub_fri_mor_t2 == 'Bio') { sub_fri_mor_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_fri_mor_t2 == 'H') { sub_fri_mor_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_mor_t2 == 'Es') { sub_fri_mor_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_fri_mor_t2 == 'G') { sub_fri_mor_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_fri_mor_t2 == 'P') { sub_fri_mor_kh_t2 = 'រូបវិទ្យា' }
    if (sub_fri_mor_t2 == 'Ac') { sub_fri_mor_kh_t2 = 'សកម្មភាព' }
    if (sub_fri_mor_t2 == 'Bi') { sub_fri_mor_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_fri_mor_t2 == 'Mo') { sub_fri_mor_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_mor_t2 == 'Eco') { sub_fri_mor_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_mor_t2 == 'K') { sub_fri_mor_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_fri_mor_t2 == 'Sci') { sub_fri_mor_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_mor_t2 == 'Soc') { sub_fri_mor_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_fri_mor_t2 == 'Di') { sub_fri_mor_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_fri_mor_t3 == 'PE') { sub_fri_mor_kh_t3 = 'កីឡា' }
    if (sub_fri_mor_t3 == 'E') { sub_fri_mor_kh_t3 = 'អង់គ្លេស' }
    if (sub_fri_mor_t3 == 'ICT') { sub_fri_mor_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_fri_mor_t3 == 'M') { sub_fri_mor_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_fri_mor_t3 == 'C') { sub_fri_mor_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_fri_mor_t3 == 'Ho') { sub_fri_mor_kh_t3 = 'គេហៈ' }
    if (sub_fri_mor_t3 == 'Bio') { sub_fri_mor_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_fri_mor_t3 == 'H') { sub_fri_mor_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_mor_t3 == 'Es') { sub_fri_mor_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_fri_mor_t3 == 'G') { sub_fri_mor_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_fri_mor_t3 == 'P') { sub_fri_mor_kh_t3 = 'រូបវិទ្យា' }
    if (sub_fri_mor_t3 == 'Ac') { sub_fri_mor_kh_t3 = 'សកម្មភាព' }
    if (sub_fri_mor_t3 == 'Bi') { sub_fri_mor_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_fri_mor_t3 == 'Mo') { sub_fri_mor_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_mor_t3 == 'Eco') { sub_fri_mor_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_mor_t3 == 'K') { sub_fri_mor_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_fri_mor_t3 == 'Sci') { sub_fri_mor_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_mor_t3 == 'Soc') { sub_fri_mor_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_fri_mor_t3 == 'Di') { sub_fri_mor_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_fri_mor_t4 == 'PE') { sub_fri_mor_kh_t4 = 'កីឡា' }
    if (sub_fri_mor_t4 == 'E') { sub_fri_mor_kh_t4 = 'អង់គ្លេស' }
    if (sub_fri_mor_t4 == 'ICT') { sub_fri_mor_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_fri_mor_t4 == 'M') { sub_fri_mor_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_fri_mor_t4 == 'C') { sub_fri_mor_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_fri_mor_t4 == 'Ho') { sub_fri_mor_kh_t4 = 'គេហៈ' }
    if (sub_fri_mor_t4 == 'Bio') { sub_fri_mor_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_fri_mor_t4 == 'H') { sub_fri_mor_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_mor_t4 == 'Es') { sub_fri_mor_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_fri_mor_t4 == 'G') { sub_fri_mor_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_fri_mor_t4 == 'P') { sub_fri_mor_kh_t4 = 'រូបវិទ្យា' }
    if (sub_fri_mor_t4 == 'Ac') { sub_fri_mor_kh_t4 = 'សកម្មភាព' }
    if (sub_fri_mor_t4 == 'Bi') { sub_fri_mor_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_fri_mor_t4 == 'Mo') { sub_fri_mor_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_mor_t4 == 'Eco') { sub_fri_mor_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_mor_t4 == 'K') { sub_fri_mor_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_fri_mor_t4 == 'Sci') { sub_fri_mor_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_mor_t4 == 'Soc') { sub_fri_mor_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_fri_mor_t4 == 'Di') { sub_fri_mor_kh_t4 = 'សរសេរតាមអាន' }

    if (sub_fri_aft_t1 == 'PE') { sub_fri_aft_kh_t1 = 'កីឡា' }
    if (sub_fri_aft_t1 == 'E') { sub_fri_aft_kh_t1 = 'អង់គ្លេស' }
    if (sub_fri_aft_t1 == 'ICT') { sub_fri_aft_kh_t1 = 'កុំព្យូទ័រ' }
    if (sub_fri_aft_t1 == 'M') { sub_fri_aft_kh_t1 = 'គណិតវិទ្យា' }
    if (sub_fri_aft_t1 == 'C') { sub_fri_aft_kh_t1 = 'គីមីវិទ្យា' }
    if (sub_fri_aft_t1 == 'Ho') { sub_fri_aft_kh_t1 = 'គេហៈ' }
    if (sub_fri_aft_t1 == 'Bio') { sub_fri_aft_kh_t1 = 'ជីវៈវិទ្យា' }
    if (sub_fri_aft_t1 == 'H') { sub_fri_aft_kh_t1 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_aft_t1 == 'Es') { sub_fri_aft_kh_t1 = 'ផែនដីវិទ្យា' }
    if (sub_fri_aft_t1 == 'G') { sub_fri_aft_kh_t1 = 'ភូមិវិទ្យា' }
    if (sub_fri_aft_t1 == 'P') { sub_fri_aft_kh_t1 = 'រូបវិទ្យា' }
    if (sub_fri_aft_t1 == 'Ac') { sub_fri_aft_kh_t1 = 'សកម្មភាព' }
    if (sub_fri_aft_t1 == 'Bi') { sub_fri_aft_kh_t1 = 'សិក្សាសីលធម៌' }
    if (sub_fri_aft_t1 == 'Mo') { sub_fri_aft_kh_t1 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_aft_t1 == 'Eco') { sub_fri_aft_kh_t1 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_aft_t1 == 'K') { sub_fri_aft_kh_t1 = 'ភាសាខ្មែរ' }
    if (sub_fri_aft_t1 == 'Sci') { sub_fri_aft_kh_t1 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_aft_t1 == 'Soc') { sub_fri_aft_kh_t1 = 'សិក្សាសង្គម' }
    if (sub_fri_aft_t1 == 'Di') { sub_fri_aft_kh_t1 = 'សរសេរតាមអាន' }

    if (sub_fri_aft_t2 == 'PE') { sub_fri_aft_kh_t2 = 'កីឡា' }
    if (sub_fri_aft_t2 == 'E') { sub_fri_aft_kh_t2 = 'អង់គ្លេស' }
    if (sub_fri_aft_t2 == 'ICT') { sub_fri_aft_kh_t2 = 'កុំព្យូទ័រ' }
    if (sub_fri_aft_t2 == 'M') { sub_fri_aft_kh_t2 = 'គណិតវិទ្យា' }
    if (sub_fri_aft_t2 == 'C') { sub_fri_aft_kh_t2 = 'គីមីវិទ្យា' }
    if (sub_fri_aft_t2 == 'Ho') { sub_fri_aft_kh_t2 = 'គេហៈ' }
    if (sub_fri_aft_t2 == 'Bio') { sub_fri_aft_kh_t2 = 'ជីវៈវិទ្យា' }
    if (sub_fri_aft_t2 == 'H') { sub_fri_aft_kh_t2 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_aft_t2 == 'Es') { sub_fri_aft_kh_t2 = 'ផែនដីវិទ្យា' }
    if (sub_fri_aft_t2 == 'G') { sub_fri_aft_kh_t2 = 'ភូមិវិទ្យា' }
    if (sub_fri_aft_t2 == 'P') { sub_fri_aft_kh_t2 = 'រូបវិទ្យា' }
    if (sub_fri_aft_t2 == 'Ac') { sub_fri_aft_kh_t2 = 'សកម្មភាព' }
    if (sub_fri_aft_t2 == 'Bi') { sub_fri_aft_kh_t2 = 'សិក្សាសីលធម៌' }
    if (sub_fri_aft_t2 == 'Mo') { sub_fri_aft_kh_t2 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_aft_t2 == 'Eco') { sub_fri_aft_kh_t2 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_aft_t2 == 'K') { sub_fri_aft_kh_t2 = 'ភាសាខ្មែរ' }
    if (sub_fri_aft_t2 == 'Sci') { sub_fri_aft_kh_t2 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_aft_t2 == 'Soc') { sub_fri_aft_kh_t2 = 'សិក្សាសង្គម' }
    if (sub_fri_aft_t2 == 'Di') { sub_fri_aft_kh_t2 = 'សរសេរតាមអាន' }

    if (sub_fri_aft_t3 == 'PE') { sub_fri_aft_kh_t3 = 'កីឡា' }
    if (sub_fri_aft_t3 == 'E') { sub_fri_aft_kh_t3 = 'អង់គ្លេស' }
    if (sub_fri_aft_t3 == 'ICT') { sub_fri_aft_kh_t3 = 'កុំព្យូទ័រ' }
    if (sub_fri_aft_t3 == 'M') { sub_fri_aft_kh_t3 = 'គណិតវិទ្យា' }
    if (sub_fri_aft_t3 == 'C') { sub_fri_aft_kh_t3 = 'គីមីវិទ្យា' }
    if (sub_fri_aft_t3 == 'Ho') { sub_fri_aft_kh_t3 = 'គេហៈ' }
    if (sub_fri_aft_t3 == 'Bio') { sub_fri_aft_kh_t3 = 'ជីវៈវិទ្យា' }
    if (sub_fri_aft_t3 == 'H') { sub_fri_aft_kh_t3 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_aft_t3 == 'Es') { sub_fri_aft_kh_t3 = 'ផែនដីវិទ្យា' }
    if (sub_fri_aft_t3 == 'G') { sub_fri_aft_kh_t3 = 'ភូមិវិទ្យា' }
    if (sub_fri_aft_t3 == 'P') { sub_fri_aft_kh_t3 = 'រូបវិទ្យា' }
    if (sub_fri_aft_t3 == 'Ac') { sub_fri_aft_kh_t3 = 'សកម្មភាព' }
    if (sub_fri_aft_t3 == 'Bi') { sub_fri_aft_kh_t3 = 'សិក្សាសីលធម៌' }
    if (sub_fri_aft_t3 == 'Mo') { sub_fri_aft_kh_t3 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_aft_t3 == 'Eco') { sub_fri_aft_kh_t3 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_aft_t3 == 'K') { sub_fri_aft_kh_t3 = 'ភាសាខ្មែរ' }
    if (sub_fri_aft_t3 == 'Sci') { sub_fri_aft_kh_t3 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_aft_t3 == 'Soc') { sub_fri_aft_kh_t3 = 'សិក្សាសង្គម' }
    if (sub_fri_aft_t3 == 'Di') { sub_fri_aft_kh_t3 = 'សរសេរតាមអាន' }

    if (sub_fri_aft_t4 == 'PE') { sub_fri_aft_kh_t4 = 'កីឡា' }
    if (sub_fri_aft_t4 == 'E') { sub_fri_aft_kh_t4 = 'អង់គ្លេស' }
    if (sub_fri_aft_t4 == 'ICT') { sub_fri_aft_kh_t4 = 'កុំព្យូទ័រ' }
    if (sub_fri_aft_t4 == 'M') { sub_fri_aft_kh_t4 = 'គណិតវិទ្យា' }
    if (sub_fri_aft_t4 == 'C') { sub_fri_aft_kh_t4 = 'គីមីវិទ្យា' }
    if (sub_fri_aft_t4 == 'Ho') { sub_fri_aft_kh_t4 = 'គេហៈ' }
    if (sub_fri_aft_t4 == 'Bio') { sub_fri_aft_kh_t4 = 'ជីវៈវិទ្យា' }
    if (sub_fri_aft_t4 == 'H') { sub_fri_aft_kh_t4 = 'ប្រវត្តិវិទ្យា' }
    if (sub_fri_aft_t4 == 'Es') { sub_fri_aft_kh_t4 = 'ផែនដីវិទ្យា' }
    if (sub_fri_aft_t4 == 'G') { sub_fri_aft_kh_t4 = 'ភូមិវិទ្យា' }
    if (sub_fri_aft_t4 == 'P') { sub_fri_aft_kh_t4 = 'រូបវិទ្យា' }
    if (sub_fri_aft_t4 == 'Ac') { sub_fri_aft_kh_t4 = 'សកម្មភាព' }
    if (sub_fri_aft_t4 == 'Bi') { sub_fri_aft_kh_t4 = 'សិក្សាសីលធម៌' }
    if (sub_fri_aft_t4 == 'Mo') { sub_fri_aft_kh_t4 = 'សីលធម៌-ពលរដ្ឋ' }
    if (sub_fri_aft_t4 == 'Eco') { sub_fri_aft_kh_t4 = 'សេដ្ឋកិច្ច' }
    if (sub_fri_aft_t4 == 'K') { sub_fri_aft_kh_t4 = 'ភាសាខ្មែរ' }
    if (sub_fri_aft_t4 == 'Sci') { sub_fri_aft_kh_t4 = 'វិទ្យាសាស្ត្រ' }
    if (sub_fri_aft_t4 == 'Soc') { sub_fri_aft_kh_t4 = 'សិក្សាសង្គម' }
    if (sub_fri_aft_t4 == 'Di') { sub_fri_aft_kh_t4 = 'សរសេរតាមអាន' }

    document.getElementById('sb_mon_mor_t1').innerHTML = sub_mon_mor_kh_t1;
    document.getElementById('sb_tue_mor_t1').innerHTML = sub_tue_mor_kh_t1;
    document.getElementById('sb_wed_mor_t1').innerHTML = sub_wed_mor_kh_t1;
    document.getElementById('sb_thu_mor_t1').innerHTML = sub_thu_mor_kh_t1;
    document.getElementById('sb_fri_mor_t1').innerHTML = sub_fri_mor_kh_t1;

    if (!tname_mon_mor_t1) {
      document.getElementById('tn_mon_mor_t1').innerHTML = '';
    } else {
      document.getElementById('tn_mon_mor_t1').innerHTML = tname_mon_mor_t1;
    }
    if (!tname_tue_mor_t1) {
      document.getElementById('tn_tue_mor_t1').innerHTML = '';
    } else {
      document.getElementById('tn_tue_mor_t1').innerHTML = tname_tue_mor_t1;
    }
    if (!tname_wed_mor_t1) {
      document.getElementById('tn_wed_mor_t1').innerHTML = '';
    } else {
      document.getElementById('tn_wed_mor_t1').innerHTML = tname_wed_mor_t1;
    }
    if (!tname_thu_mor_t1) {
      document.getElementById('tn_thu_mor_t1').innerHTML = '';
    } else {
      document.getElementById('tn_thu_mor_t1').innerHTML = tname_thu_mor_t1;
    }
    if (!tname_fri_mor_t1) {
      document.getElementById('tn_fri_mor_t1').innerHTML = '';
    } else {
      document.getElementById('tn_fri_mor_t1').innerHTML = tname_fri_mor_t1;
    }

    document.getElementById('sb_mon_mor_t2').innerHTML = sub_mon_mor_kh_t2;
    document.getElementById('sb_tue_mor_t2').innerHTML = sub_tue_mor_kh_t2;
    document.getElementById('sb_wed_mor_t2').innerHTML = sub_wed_mor_kh_t2;
    document.getElementById('sb_thu_mor_t2').innerHTML = sub_thu_mor_kh_t2;
    document.getElementById('sb_fri_mor_t2').innerHTML = sub_fri_mor_kh_t2;

    if (!tname_mon_mor_t2) {
      document.getElementById('tn_mon_mor_t2').innerHTML = '';
    } else {
      document.getElementById('tn_mon_mor_t2').innerHTML = tname_mon_mor_t2;
    }
    if (!tname_tue_mor_t2) {
      document.getElementById('tn_tue_mor_t2').innerHTML = '';
    } else {
      document.getElementById('tn_tue_mor_t2').innerHTML = tname_tue_mor_t2;
    }
    if (!tname_wed_mor_t2) {
      document.getElementById('tn_wed_mor_t2').innerHTML = '';
    } else {
      document.getElementById('tn_wed_mor_t2').innerHTML = tname_wed_mor_t2;
    }
    if (!tname_thu_mor_t2) {
      document.getElementById('tn_thu_mor_t2').innerHTML = '';
    } else {
      document.getElementById('tn_thu_mor_t2').innerHTML = tname_thu_mor_t2;
    }
    if (!tname_fri_mor_t2) {
      document.getElementById('tn_fri_mor_t2').innerHTML = '';
    } else {
      document.getElementById('tn_fri_mor_t2').innerHTML = tname_fri_mor_t2;
    }
    document.getElementById('sb_mon_mor_t3').innerHTML = sub_mon_mor_kh_t3;
    document.getElementById('sb_tue_mor_t3').innerHTML = sub_tue_mor_kh_t3;
    document.getElementById('sb_wed_mor_t3').innerHTML = sub_wed_mor_kh_t3;
    document.getElementById('sb_thu_mor_t3').innerHTML = sub_thu_mor_kh_t3;
    document.getElementById('sb_fri_mor_t3').innerHTML = sub_fri_mor_kh_t3;

    if (!tname_mon_mor_t3) {
      document.getElementById('tn_mon_mor_t3').innerHTML = '';
    } else {
      document.getElementById('tn_mon_mor_t3').innerHTML = tname_mon_mor_t3;
    }
    if (!tname_tue_mor_t3) {
      document.getElementById('tn_tue_mor_t3').innerHTML = '';
    } else {
      document.getElementById('tn_tue_mor_t3').innerHTML = tname_tue_mor_t3;
    }
    if (!tname_wed_mor_t3) {
      document.getElementById('tn_wed_mor_t3').innerHTML = '';
    } else {
      document.getElementById('tn_wed_mor_t3').innerHTML = tname_wed_mor_t3;
    }
    if (!tname_thu_mor_t3) {
      document.getElementById('tn_thu_mor_t3').innerHTML = '';
    } else {
      document.getElementById('tn_thu_mor_t3').innerHTML = tname_thu_mor_t3;
    }
    if (!tname_fri_mor_t3) {
      document.getElementById('tn_fri_mor_t3').innerHTML = '';
    } else {
      document.getElementById('tn_fri_mor_t3').innerHTML = tname_fri_mor_t3;
    }

    document.getElementById('sb_mon_mor_t4').innerHTML = sub_mon_mor_kh_t4;
    document.getElementById('sb_tue_mor_t4').innerHTML = sub_tue_mor_kh_t4;
    document.getElementById('sb_wed_mor_t4').innerHTML = sub_wed_mor_kh_t4;
    document.getElementById('sb_thu_mor_t4').innerHTML = sub_thu_mor_kh_t4;
    document.getElementById('sb_fri_mor_t4').innerHTML = sub_fri_mor_kh_t4;

    if (!tname_mon_mor_t4) {
      document.getElementById('tn_mon_mor_t4').innerHTML = '';
    } else {
      document.getElementById('tn_mon_mor_t4').innerHTML = tname_mon_mor_t4;
    }
    if (!tname_tue_mor_t4) {
      document.getElementById('tn_tue_mor_t4').innerHTML = '';
    } else {
      document.getElementById('tn_tue_mor_t4').innerHTML = tname_tue_mor_t4;
    }
    if (!tname_wed_mor_t4) {
      document.getElementById('tn_wed_mor_t4').innerHTML = '';
    } else {
      document.getElementById('tn_wed_mor_t4').innerHTML = tname_wed_mor_t4;
    }
    if (!tname_thu_mor_t4) {
      document.getElementById('tn_thu_mor_t4').innerHTML = '';
    } else {
      document.getElementById('tn_thu_mor_t4').innerHTML = tname_thu_mor_t4;
    }
    if (!tname_fri_mor_t4) {
      document.getElementById('tn_fri_mor_t4').innerHTML = '';
    } else {
      document.getElementById('tn_fri_mor_t4').innerHTML = tname_fri_mor_t4;
    }

    document.getElementById('sb_mon_aft_t1').innerHTML = sub_mon_aft_kh_t1;
    document.getElementById('sb_tue_aft_t1').innerHTML = sub_tue_aft_kh_t1;
    document.getElementById('sb_wed_aft_t1').innerHTML = sub_wed_aft_kh_t1;
    document.getElementById('sb_thu_aft_t1').innerHTML = sub_thu_aft_kh_t1;
    document.getElementById('sb_fri_aft_t1').innerHTML = sub_fri_aft_kh_t1;

    if (!tname_mon_aft_t1) {
      document.getElementById('tn_mon_aft_t1').innerHTML = '';
    } else {
      document.getElementById('tn_mon_aft_t1').innerHTML = tname_mon_aft_t1;
    }
    if (!tname_tue_aft_t1) {
      document.getElementById('tn_tue_aft_t1').innerHTML = '';
    } else {
      document.getElementById('tn_tue_aft_t1').innerHTML = tname_tue_aft_t1;
    }
    if (!tname_wed_aft_t1) {
      document.getElementById('tn_wed_aft_t1').innerHTML = '';
    } else {
      document.getElementById('tn_wed_aft_t1').innerHTML = tname_wed_aft_t1;
    }
    if (!tname_thu_aft_t1) {
      document.getElementById('tn_thu_aft_t1').innerHTML = '';
    } else {
      document.getElementById('tn_thu_aft_t1').innerHTML = tname_thu_aft_t1;
    }
    if (!tname_fri_aft_t1) {
      document.getElementById('tn_fri_aft_t1').innerHTML = '';
    } else {
      document.getElementById('tn_fri_aft_t1').innerHTML = tname_fri_aft_t1;
    }

    document.getElementById('sb_mon_aft_t2').innerHTML = sub_mon_aft_kh_t2;
    document.getElementById('sb_tue_aft_t2').innerHTML = sub_tue_aft_kh_t2;
    document.getElementById('sb_wed_aft_t2').innerHTML = sub_wed_aft_kh_t2;
    document.getElementById('sb_thu_aft_t2').innerHTML = sub_thu_aft_kh_t2;
    document.getElementById('sb_fri_aft_t2').innerHTML = sub_fri_aft_kh_t2;
    if (!tname_mon_aft_t2) {
      document.getElementById('tn_mon_aft_t2').innerHTML = '';
    } else {
      document.getElementById('tn_mon_aft_t2').innerHTML = tname_mon_aft_t2;
    }
    if (!tname_tue_aft_t2) {
      document.getElementById('tn_tue_aft_t2').innerHTML = '';
    } else {
      document.getElementById('tn_tue_aft_t2').innerHTML = tname_tue_aft_t2;
    }
    if (!tname_wed_aft_t2) {
      document.getElementById('tn_wed_aft_t2').innerHTML = '';
    } else {
      document.getElementById('tn_wed_aft_t2').innerHTML = tname_wed_aft_t2;
    }
    if (!tname_thu_aft_t2) {
      document.getElementById('tn_thu_aft_t2').innerHTML = '';
    } else {
      document.getElementById('tn_thu_aft_t2').innerHTML = tname_thu_aft_t2;
    }
    if (!tname_fri_aft_t2) {
      document.getElementById('tn_fri_aft_t2').innerHTML = '';
    } else {
      document.getElementById('tn_fri_aft_t2').innerHTML = tname_fri_aft_t2;
    }

    document.getElementById('sb_mon_aft_t3').innerHTML = sub_mon_aft_kh_t3;
    document.getElementById('sb_tue_aft_t3').innerHTML = sub_tue_aft_kh_t3;
    document.getElementById('sb_wed_aft_t3').innerHTML = sub_wed_aft_kh_t3;
    document.getElementById('sb_thu_aft_t3').innerHTML = sub_thu_aft_kh_t3;
    document.getElementById('sb_fri_aft_t3').innerHTML = sub_fri_aft_kh_t3;

    if (!tname_mon_aft_t3) {
      document.getElementById('tn_mon_aft_t3').innerHTML = '';
    } else {
      document.getElementById('tn_mon_aft_t3').innerHTML = tname_mon_aft_t3;
    }
    if (!tname_tue_aft_t3) {
      document.getElementById('tn_tue_aft_t3').innerHTML = '';
    } else {
      document.getElementById('tn_tue_aft_t3').innerHTML = tname_tue_aft_t3;
    }
    if (!tname_wed_aft_t3) {
      document.getElementById('tn_wed_aft_t3').innerHTML = '';
    } else {
      document.getElementById('tn_wed_aft_t3').innerHTML = tname_wed_aft_t3;
    }
    if (!tname_thu_aft_t3) {
      document.getElementById('tn_thu_aft_t3').innerHTML = '';
    } else {
      document.getElementById('tn_thu_aft_t3').innerHTML = tname_thu_aft_t3;
    }
    if (!tname_fri_aft_t3) {
      document.getElementById('tn_fri_aft_t3').innerHTML = '';
    } else {
      document.getElementById('tn_fri_aft_t3').innerHTML = tname_fri_aft_t3;
    }

    document.getElementById('sb_mon_aft_t4').innerHTML = sub_mon_aft_kh_t4;
    document.getElementById('sb_tue_aft_t4').innerHTML = sub_tue_aft_kh_t4;
    document.getElementById('sb_wed_aft_t4').innerHTML = sub_wed_aft_kh_t4;
    document.getElementById('sb_thu_aft_t4').innerHTML = sub_thu_aft_kh_t4;
    document.getElementById('sb_fri_aft_t4').innerHTML = sub_fri_aft_kh_t4;

    if (!tname_mon_aft_t4) {
      document.getElementById('tn_mon_aft_t4').innerHTML = '';
    } else {
      document.getElementById('tn_mon_aft_t4').innerHTML = tname_mon_aft_t4;
    }
    if (!tname_tue_aft_t4) {
      document.getElementById('tn_tue_aft_t4').innerHTML = '';
    } else {
      document.getElementById('tn_tue_aft_t4').innerHTML = tname_tue_aft_t4;
    }
    if (!tname_wed_aft_t4) {
      document.getElementById('tn_wed_aft_t4').innerHTML = '';
    } else {
      document.getElementById('tn_wed_aft_t4').innerHTML = tname_wed_aft_t4;
    }
    if (!tname_thu_aft_t4) {
      document.getElementById('tn_thu_aft_t4').innerHTML = '';
    } else {
      document.getElementById('tn_thu_aft_t4').innerHTML = tname_thu_aft_t4;
    }
    if (!tname_fri_aft_t4) {
      document.getElementById('tn_fri_aft_t4').innerHTML = '';
    } else {
      document.getElementById('tn_fri_aft_t4').innerHTML = tname_fri_aft_t4;
    }
    let subjects = [

    ].concat(
      sub_mon_mor_kh_t1,
      sub_mon_mor_kh_t2,
      sub_mon_mor_kh_t3,
      sub_mon_mor_kh_t4,

      sub_mon_aft_kh_t1,
      sub_mon_aft_kh_t2,
      sub_mon_aft_kh_t3,
      sub_mon_aft_kh_t4,

      sub_tue_mor_kh_t1,
      sub_tue_mor_kh_t2,
      sub_tue_mor_kh_t3,
      sub_tue_mor_kh_t4,
      sub_tue_aft_kh_t1,
      sub_tue_aft_kh_t2,
      sub_tue_aft_kh_t3,
      sub_tue_aft_kh_t4,

      sub_wed_mor_kh_t1,
      sub_wed_mor_kh_t2,
      sub_wed_mor_kh_t3,
      sub_wed_mor_kh_t4,
      sub_wed_aft_kh_t1,
      sub_wed_aft_kh_t2,
      sub_wed_aft_kh_t3,
      sub_wed_aft_kh_t4,

      sub_thu_mor_kh_t1,
      sub_thu_mor_kh_t2,
      sub_thu_mor_kh_t3,
      sub_thu_mor_kh_t4,
      sub_thu_aft_kh_t1,
      sub_thu_aft_kh_t2,
      sub_thu_aft_kh_t3,
      sub_thu_aft_kh_t4,

      sub_fri_mor_kh_t1,
      sub_fri_mor_kh_t2,
      sub_fri_mor_kh_t3,
      sub_fri_mor_kh_t4,
      sub_fri_aft_kh_t1,
      sub_fri_aft_kh_t2,
      sub_fri_aft_kh_t3,
      sub_fri_aft_kh_t4,
    )
    function countSubjects(subjects) {
      const subjectCounts = {}; // Object to store subject counts

      subjects.forEach(subject => {
        if (subject) {
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        }
      });

      return subjectCounts;
    }

    const counts = countSubjects(subjects);
    const subjectCountsElement = document.getElementById('subjectCounts');
    subjectCountsElement.textContent = ''; // Clear any existing content

    for (const subject in counts) {
      subjectCountsElement.innerHTML += `
                  <tr class="mytr" style="vertical-align: top;border: none;line-height: 20px;height: 20px;">
                      <td class="p-0 pr-2" style="border: none;text-align: start;line-height: 20px;">
                          <span class="pl-4">- ${subject}:</span>
                      </td>
                      <td class="p-0" style="border: none;text-align: end;line-height: 20px;color: blue;">
                          <span class="pr-4">
                              ${counts[subject]} ម៉ោង
                          </span>
                      </td>
                  </tr>
                  `;
    }

    // })

  }
  const ShowData = (da) => {
    setTimeout(() => {
      //Select username and img url
      const dropdownContent = document.querySelector('.dropdown-content');

      dropdownContent.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
          const id = event.target.dataset.label;
          const imageUrl = event.target.dataset.image;
          const t_grade = event.target.dataset.t_grade;
          const teacher_type = event.target.dataset.teacher_type;
          const getnickname = event.target.dataset.nickname;
          user_id.current.value = id
          user_img.current.value = imageUrl
          setuser_nick(getnickname)
          // getT_grade.current.value = t_grade
          // getteacher_type.current.value = teacher_type
          setgetteacher_type(teacher_type)
          setgetT_grade(t_grade)
          dropdownContent.classList.remove('show');
        }
      });
      //Check teacher the same in the row
      const uu = document.querySelector("#tbody_time_table");
      const td1 = uu.querySelectorAll('.tr1');
      const td2 = uu.querySelectorAll('.tr2');
      const td3 = uu.querySelectorAll('.tr3');
      const td4 = uu.querySelectorAll('.tr4');
      const td5 = uu.querySelectorAll('.tr5');
      const td6 = uu.querySelectorAll('.tr6');
      const td7 = uu.querySelectorAll('.tr7');
      const td8 = uu.querySelectorAll('.tr8');
      const td9 = uu.querySelectorAll('.tr9');
      const td10 = uu.querySelectorAll('.tr10');
      const td11 = uu.querySelectorAll('.tr11');
      const td12 = uu.querySelectorAll('.tr12');
      const td13 = uu.querySelectorAll('.tr13');
      const td14 = uu.querySelectorAll('.tr14');
      const td15 = uu.querySelectorAll('.tr15');
      const td16 = uu.querySelectorAll('.tr16');
      const td17 = uu.querySelectorAll('.tr17');
      const td18 = uu.querySelectorAll('.tr18');
      const td19 = uu.querySelectorAll('.tr19');
      const td20 = uu.querySelectorAll('.tr20');
      const td21 = uu.querySelectorAll('.tr21');
      const td22 = uu.querySelectorAll('.tr22');
      const td23 = uu.querySelectorAll('.tr23');
      const td24 = uu.querySelectorAll('.tr24');
      const td25 = uu.querySelectorAll('.tr25');
      const td26 = uu.querySelectorAll('.tr26');
      const td27 = uu.querySelectorAll('.tr27');
      const td28 = uu.querySelectorAll('.tr28');
      const td29 = uu.querySelectorAll('.tr29');
      const td30 = uu.querySelectorAll('.tr30');
      const td31 = uu.querySelectorAll('.tr31');
      const td32 = uu.querySelectorAll('.tr32');
      const td33 = uu.querySelectorAll('.tr33');
      const td34 = uu.querySelectorAll('.tr34');
      const td35 = uu.querySelectorAll('.tr35');
      const td36 = uu.querySelectorAll('.tr36');
      const td37 = uu.querySelectorAll('.tr37');
      const td38 = uu.querySelectorAll('.tr38');
      const td39 = uu.querySelectorAll('.tr39');
      const td40 = uu.querySelectorAll('.tr40');
      td1.forEach(e => {
        let d = e.dataset.t;
        data_row_1.push(d)
      })
      td2.forEach(e => {
        let d = e.dataset.t;
        data_row_2.push(d)
      })
      td3.forEach(e => {
        let d = e.dataset.t;
        data_row_3.push(d)
      })
      td4.forEach(e => {
        let d = e.dataset.t;
        data_row_4.push(d)
      })
      td5.forEach(e => {
        let d = e.dataset.t;
        data_row_5.push(d)
      })
      td6.forEach(e => {
        let d = e.dataset.t;
        data_row_6.push(d)
      })
      td7.forEach(e => {
        let d = e.dataset.t;
        data_row_7.push(d)
      })
      td8.forEach(e => {
        let d = e.dataset.t;
        data_row_8.push(d)
      })
      td9.forEach(e => {
        let d = e.dataset.t;
        data_row_9.push(d)
      })
      td10.forEach(e => {
        let d = e.dataset.t;
        data_row_10.push(d)
      })
      td11.forEach(e => {
        let d = e.dataset.t;
        data_row_11.push(d)
      })
      td12.forEach(e => {
        let d = e.dataset.t;
        data_row_12.push(d)
      })
      td13.forEach(e => {
        let d = e.dataset.t;
        data_row_13.push(d)
      })
      td14.forEach(e => {
        let d = e.dataset.t;
        data_row_14.push(d)
      })
      td15.forEach(e => {
        let d = e.dataset.t;
        data_row_15.push(d)
      })
      td16.forEach(e => {
        let d = e.dataset.t;
        data_row_16.push(d)
      })
      td17.forEach(e => {
        let d = e.dataset.t;
        data_row_17.push(d)
      })
      td18.forEach(e => {
        let d = e.dataset.t;
        data_row_18.push(d)
      })
      td19.forEach(e => {
        let d = e.dataset.t;
        data_row_19.push(d)
      })
      td20.forEach(e => {
        let d = e.dataset.t;
        data_row_20.push(d)
      })
      td21.forEach(e => {
        let d = e.dataset.t;
        data_row_21.push(d)
      })
      td22.forEach(e => {
        let d = e.dataset.t;
        data_row_22.push(d)
      })
      td23.forEach(e => {
        let d = e.dataset.t;
        data_row_23.push(d)
      })
      td24.forEach(e => {
        let d = e.dataset.t;
        data_row_24.push(d)
      })
      td25.forEach(e => {
        let d = e.dataset.t;
        data_row_25.push(d)
      })
      td26.forEach(e => {
        let d = e.dataset.t;
        data_row_26.push(d)
      })
      td27.forEach(e => {
        let d = e.dataset.t;
        data_row_27.push(d)
      })
      td28.forEach(e => {
        let d = e.dataset.t;
        data_row_28.push(d)
      })
      td29.forEach(e => {
        let d = e.dataset.t;
        data_row_29.push(d)
      })
      td30.forEach(e => {
        let d = e.dataset.t;
        data_row_30.push(d)
      })
      td31.forEach(e => {
        let d = e.dataset.t;
        data_row_31.push(d)
      })
      td32.forEach(e => {
        let d = e.dataset.t;
        data_row_32.push(d)
      })
      td33.forEach(e => {
        let d = e.dataset.t;
        data_row_33.push(d)
      })
      td34.forEach(e => {
        let d = e.dataset.t;
        data_row_34.push(d)
      })
      td35.forEach(e => {
        let d = e.dataset.t;
        data_row_35.push(d)
      })
      td36.forEach(e => {
        let d = e.dataset.t;
        data_row_36.push(d)
      })
      td37.forEach(e => {
        let d = e.dataset.t;
        data_row_37.push(d)
      })
      td38.forEach(e => {
        let d = e.dataset.t;
        data_row_38.push(d)
      })
      td39.forEach(e => {
        let d = e.dataset.t;
        data_row_39.push(d)
      })
      td40.forEach(e => {
        let d = e.dataset.t;
        data_row_40.push(d)
      })
    }, 1000);

    const selectData = (e) => {
      const id = e.currentTarget.dataset.id
      const g = e.currentTarget.dataset.g
      const nickname = e.currentTarget.dataset.nickname
      const tc = e.currentTarget.dataset.tc
      const img = e.currentTarget.dataset.img
      const sub = e.currentTarget.dataset.sub
      const cell = e.currentTarget.dataset.cell
      const t_grade_mon_mor_t1 = e.currentTarget.dataset.t_grade_mon_mor_t1
      const t_grade_mon_mor_t2 = e.currentTarget.dataset.t_grade_mon_mor_t2
      const t_grade_mon_mor_t3 = e.currentTarget.dataset.t_grade_mon_mor_t3
      const t_grade_mon_mor_t4 = e.currentTarget.dataset.t_grade_mon_mor_t4
      const t_grade_mon_aft_t1 = e.currentTarget.dataset.t_grade_mon_aft_t1
      const t_grade_mon_aft_t2 = e.currentTarget.dataset.t_grade_mon_aft_t2
      const t_grade_mon_aft_t3 = e.currentTarget.dataset.t_grade_mon_aft_t3
      const t_grade_mon_aft_t4 = e.currentTarget.dataset.t_grade_mon_aft_t4
      const t_grade_tue_mor_t1 = e.currentTarget.dataset.t_grade_tue_mor_t1
      const t_grade_tue_mor_t2 = e.currentTarget.dataset.t_grade_tue_mor_t2
      const t_grade_tue_mor_t3 = e.currentTarget.dataset.t_grade_tue_mor_t3
      const t_grade_tue_mor_t4 = e.currentTarget.dataset.t_grade_tue_mor_t4
      const t_grade_tue_aft_t1 = e.currentTarget.dataset.t_grade_tue_aft_t1
      const t_grade_tue_aft_t2 = e.currentTarget.dataset.t_grade_tue_aft_t2
      const t_grade_tue_aft_t3 = e.currentTarget.dataset.t_grade_tue_aft_t3
      const t_grade_tue_aft_t4 = e.currentTarget.dataset.t_grade_tue_aft_t4
      const t_grade_wed_mor_t1 = e.currentTarget.dataset.t_grade_wed_mor_t1
      const t_grade_wed_mor_t2 = e.currentTarget.dataset.t_grade_wed_mor_t2
      const t_grade_wed_mor_t3 = e.currentTarget.dataset.t_grade_wed_mor_t3
      const t_grade_wed_mor_t4 = e.currentTarget.dataset.t_grade_wed_mor_t4
      const t_grade_wed_aft_t1 = e.currentTarget.dataset.t_grade_wed_aft_t1
      const t_grade_wed_aft_t2 = e.currentTarget.dataset.t_grade_wed_aft_t2
      const t_grade_wed_aft_t3 = e.currentTarget.dataset.t_grade_wed_aft_t3
      const t_grade_wed_aft_t4 = e.currentTarget.dataset.t_grade_wed_aft_t4
      const t_grade_thu_mor_t1 = e.currentTarget.dataset.t_grade_thu_mor_t1
      const t_grade_thu_mor_t2 = e.currentTarget.dataset.t_grade_thu_mor_t2
      const t_grade_thu_mor_t3 = e.currentTarget.dataset.t_grade_thu_mor_t3
      const t_grade_thu_mor_t4 = e.currentTarget.dataset.t_grade_thu_mor_t4
      const t_grade_thu_aft_t1 = e.currentTarget.dataset.t_grade_thu_aft_t1
      const t_grade_thu_aft_t2 = e.currentTarget.dataset.t_grade_thu_aft_t2
      const t_grade_thu_aft_t3 = e.currentTarget.dataset.t_grade_thu_aft_t3
      const t_grade_thu_aft_t4 = e.currentTarget.dataset.t_grade_thu_aft_t4
      const t_grade_fri_mor_t1 = e.currentTarget.dataset.t_grade_fri_mor_t1
      const t_grade_fri_mor_t2 = e.currentTarget.dataset.t_grade_fri_mor_t2
      const t_grade_fri_mor_t3 = e.currentTarget.dataset.t_grade_fri_mor_t3
      const t_grade_fri_mor_t4 = e.currentTarget.dataset.t_grade_fri_mor_t4
      const t_grade_fri_aft_t1 = e.currentTarget.dataset.t_grade_fri_aft_t1
      const t_grade_fri_aft_t2 = e.currentTarget.dataset.t_grade_fri_aft_t2
      const t_grade_fri_aft_t3 = e.currentTarget.dataset.t_grade_fri_aft_t3
      const t_grade_fri_aft_t4 = e.currentTarget.dataset.t_grade_fri_aft_t4

      const teacher_type_mon_mor_t1 = e.currentTarget.dataset.teacher_type_mon_mor_t1
      const teacher_type_mon_mor_t2 = e.currentTarget.dataset.teacher_type_mon_mor_t2
      const teacher_type_mon_mor_t3 = e.currentTarget.dataset.teacher_type_mon_mor_t3
      const teacher_type_mon_mor_t4 = e.currentTarget.dataset.teacher_type_mon_mor_t4
      const teacher_type_mon_aft_t1 = e.currentTarget.dataset.teacher_type_mon_aft_t1
      const teacher_type_mon_aft_t2 = e.currentTarget.dataset.teacher_type_mon_aft_t2
      const teacher_type_mon_aft_t3 = e.currentTarget.dataset.teacher_type_mon_aft_t3
      const teacher_type_mon_aft_t4 = e.currentTarget.dataset.teacher_type_mon_aft_t4
      const teacher_type_tue_mor_t1 = e.currentTarget.dataset.teacher_type_tue_mor_t1
      const teacher_type_tue_mor_t2 = e.currentTarget.dataset.teacher_type_tue_mor_t2
      const teacher_type_tue_mor_t3 = e.currentTarget.dataset.teacher_type_tue_mor_t3
      const teacher_type_tue_mor_t4 = e.currentTarget.dataset.teacher_type_tue_mor_t4
      const teacher_type_tue_aft_t1 = e.currentTarget.dataset.teacher_type_tue_aft_t1
      const teacher_type_tue_aft_t2 = e.currentTarget.dataset.teacher_type_tue_aft_t2
      const teacher_type_tue_aft_t3 = e.currentTarget.dataset.teacher_type_tue_aft_t3
      const teacher_type_tue_aft_t4 = e.currentTarget.dataset.teacher_type_tue_aft_t4
      const teacher_type_wed_mor_t1 = e.currentTarget.dataset.teacher_type_wed_mor_t1
      const teacher_type_wed_mor_t2 = e.currentTarget.dataset.teacher_type_wed_mor_t2
      const teacher_type_wed_mor_t3 = e.currentTarget.dataset.teacher_type_wed_mor_t3
      const teacher_type_wed_mor_t4 = e.currentTarget.dataset.teacher_type_wed_mor_t4
      const teacher_type_wed_aft_t1 = e.currentTarget.dataset.teacher_type_wed_aft_t1
      const teacher_type_wed_aft_t2 = e.currentTarget.dataset.teacher_type_wed_aft_t2
      const teacher_type_wed_aft_t3 = e.currentTarget.dataset.teacher_type_wed_aft_t3
      const teacher_type_wed_aft_t4 = e.currentTarget.dataset.teacher_type_wed_aft_t4
      const teacher_type_thu_mor_t1 = e.currentTarget.dataset.teacher_type_thu_mor_t1
      const teacher_type_thu_mor_t2 = e.currentTarget.dataset.teacher_type_thu_mor_t2
      const teacher_type_thu_mor_t3 = e.currentTarget.dataset.teacher_type_thu_mor_t3
      const teacher_type_thu_mor_t4 = e.currentTarget.dataset.teacher_type_thu_mor_t4
      const teacher_type_thu_aft_t1 = e.currentTarget.dataset.teacher_type_thu_aft_t1
      const teacher_type_thu_aft_t2 = e.currentTarget.dataset.teacher_type_thu_aft_t2
      const teacher_type_thu_aft_t3 = e.currentTarget.dataset.teacher_type_thu_aft_t3
      const teacher_type_thu_aft_t4 = e.currentTarget.dataset.teacher_type_thu_aft_t4
      const teacher_type_fri_mor_t1 = e.currentTarget.dataset.teacher_type_fri_mor_t1
      const teacher_type_fri_mor_t2 = e.currentTarget.dataset.teacher_type_fri_mor_t2
      const teacher_type_fri_mor_t3 = e.currentTarget.dataset.teacher_type_fri_mor_t3
      const teacher_type_fri_mor_t4 = e.currentTarget.dataset.teacher_type_fri_mor_t4
      const teacher_type_fri_aft_t1 = e.currentTarget.dataset.teacher_type_fri_aft_t1
      const teacher_type_fri_aft_t2 = e.currentTarget.dataset.teacher_type_fri_aft_t2
      const teacher_type_fri_aft_t3 = e.currentTarget.dataset.teacher_type_fri_aft_t3
      const teacher_type_fri_aft_t4 = e.currentTarget.dataset.teacher_type_fri_aft_t4
      setdata_cell(cell)
      setUser_g(g.replace(/\b0+/g, ''))

      if (id) {
        user_id.current.value = id
        user_img.current.value = img
        setuser_nick(e.currentTarget.dataset.nickname)
        set_user_sub.current.value = sub
        if (t_grade_mon_mor_t1) {
          setgetT_grade(t_grade_mon_mor_t1)
        }
        if (t_grade_mon_mor_t2) {
          setgetT_grade(t_grade_mon_mor_t2)

        }
        if (t_grade_mon_mor_t3) {
          setgetT_grade(t_grade_mon_mor_t3)

        }
        if (t_grade_mon_mor_t4) {
          setgetT_grade(t_grade_mon_mor_t4)

        }
        if (t_grade_mon_aft_t1) {
          setgetT_grade(t_grade_mon_aft_t1)

        }
        if (t_grade_mon_aft_t2) {
          setgetT_grade(t_grade_mon_aft_t2)

        }
        if (t_grade_mon_aft_t3) {
          setgetT_grade(t_grade_mon_aft_t3)

        }
        if (t_grade_mon_aft_t4) {
          setgetT_grade(t_grade_mon_aft_t4)

        }
        if (t_grade_tue_mor_t1) {
          setgetT_grade(t_grade_tue_mor_t1)

        }
        if (t_grade_tue_mor_t2) {
          setgetT_grade(t_grade_tue_mor_t2)

        }
        if (t_grade_tue_mor_t3) {
          setgetT_grade(t_grade_tue_mor_t3)

        }
        if (t_grade_tue_mor_t4) {
          setgetT_grade(t_grade_tue_mor_t4)

        }
        if (t_grade_tue_aft_t1) {
          setgetT_grade(t_grade_tue_aft_t1)

        }
        if (t_grade_tue_aft_t2) {
          setgetT_grade(t_grade_tue_aft_t2)

        }
        if (t_grade_tue_aft_t3) {
          setgetT_grade(t_grade_tue_aft_t3)

        }
        if (t_grade_tue_aft_t4) {
          setgetT_grade(t_grade_tue_aft_t4)

        }
        if (t_grade_wed_mor_t1) {
          setgetT_grade(t_grade_wed_mor_t1)

        }
        if (t_grade_wed_mor_t2) {
          setgetT_grade(t_grade_wed_mor_t2)

        }
        if (t_grade_wed_mor_t3) {
          setgetT_grade(t_grade_wed_mor_t3)

        }
        if (t_grade_wed_mor_t4) {
          setgetT_grade(t_grade_wed_mor_t4)

        }
        if (t_grade_wed_aft_t1) {
          setgetT_grade(t_grade_wed_aft_t1)

        }
        if (t_grade_wed_aft_t2) {
          setgetT_grade(t_grade_wed_aft_t2)

        }
        if (t_grade_wed_aft_t3) {
          setgetT_grade(t_grade_wed_aft_t3)

        }
        if (t_grade_wed_aft_t4) {
          setgetT_grade(t_grade_wed_aft_t4)

        }
        if (t_grade_thu_mor_t1) {
          setgetT_grade(t_grade_thu_mor_t1)

        }
        if (t_grade_thu_mor_t2) {
          setgetT_grade(t_grade_thu_mor_t2)

        }
        if (t_grade_thu_mor_t3) {
          setgetT_grade(t_grade_thu_mor_t3)

        }
        if (t_grade_thu_mor_t4) {
          setgetT_grade(t_grade_thu_mor_t4)

        }
        if (t_grade_thu_aft_t1) {
          setgetT_grade(t_grade_thu_aft_t1)

        }
        if (t_grade_thu_aft_t2) {
          setgetT_grade(t_grade_thu_aft_t2)

        }
        if (t_grade_thu_aft_t3) {
          setgetT_grade(t_grade_thu_aft_t3)

        }
        if (t_grade_thu_aft_t4) {
          setgetT_grade(t_grade_thu_aft_t4)

        }
        if (t_grade_fri_mor_t1) {
          setgetT_grade(t_grade_fri_mor_t1)

        }
        if (t_grade_fri_mor_t2) {
          setgetT_grade(t_grade_fri_mor_t2)

        }
        if (t_grade_fri_mor_t3) {
          setgetT_grade(t_grade_fri_mor_t3)

        }
        if (t_grade_fri_mor_t4) {
          setgetT_grade(t_grade_fri_mor_t4)

        }
        if (t_grade_fri_aft_t1) {
          setgetT_grade(t_grade_fri_aft_t1)

        }
        if (t_grade_fri_aft_t2) {
          setgetT_grade(t_grade_fri_aft_t2)

        }
        if (t_grade_fri_aft_t3) {
          setgetT_grade(t_grade_fri_aft_t3)

        }
        if (t_grade_fri_aft_t4) {
          setgetT_grade(t_grade_fri_aft_t4)

        }

        if (teacher_type_mon_mor_t1) {
          setgetteacher_type(teacher_type_mon_mor_t1)
        }
        if (teacher_type_mon_mor_t2) {
          setgetteacher_type(teacher_type_mon_mor_t2)

        }
        if (teacher_type_mon_mor_t3) {
          setgetteacher_type(teacher_type_mon_mor_t3)

        }
        if (teacher_type_mon_mor_t4) {
          setgetteacher_type(teacher_type_mon_mor_t4)

        }
        if (teacher_type_mon_aft_t1) {
          setgetteacher_type(teacher_type_mon_aft_t1)

        }
        if (teacher_type_mon_aft_t2) {
          setgetteacher_type(teacher_type_mon_aft_t2)

        }
        if (teacher_type_mon_aft_t3) {
          setgetteacher_type(teacher_type_mon_aft_t3)

        }
        if (teacher_type_mon_aft_t4) {
          setgetteacher_type(teacher_type_mon_aft_t4)

        }
        if (teacher_type_tue_mor_t1) {
          setgetteacher_type(teacher_type_tue_mor_t1)

        }
        if (teacher_type_tue_mor_t2) {
          setgetteacher_type(teacher_type_tue_mor_t2)

        }
        if (teacher_type_tue_mor_t3) {
          setgetteacher_type(teacher_type_tue_mor_t3)

        }
        if (teacher_type_tue_mor_t4) {
          setgetteacher_type(teacher_type_tue_mor_t4)

        }
        if (teacher_type_tue_aft_t1) {
          setgetteacher_type(teacher_type_tue_aft_t1)

        }
        if (teacher_type_tue_aft_t2) {
          setgetteacher_type(teacher_type_tue_aft_t2)

        }
        if (teacher_type_tue_aft_t3) {
          setgetteacher_type(teacher_type_tue_aft_t3)

        }
        if (teacher_type_tue_aft_t4) {
          setgetteacher_type(teacher_type_tue_aft_t4)

        }
        if (teacher_type_wed_mor_t1) {
          setgetteacher_type(teacher_type_wed_mor_t1)

        }
        if (teacher_type_wed_mor_t2) {
          setgetteacher_type(teacher_type_wed_mor_t2)

        }
        if (teacher_type_wed_mor_t3) {
          setgetteacher_type(teacher_type_wed_mor_t3)

        }
        if (teacher_type_wed_mor_t4) {
          setgetteacher_type(teacher_type_wed_mor_t4)

        }
        if (teacher_type_wed_aft_t1) {
          setgetteacher_type(teacher_type_wed_aft_t1)

        }
        if (teacher_type_wed_aft_t2) {
          setgetteacher_type(teacher_type_wed_aft_t2)

        }
        if (teacher_type_wed_aft_t3) {
          setgetteacher_type(teacher_type_wed_aft_t3)

        }
        if (teacher_type_wed_aft_t4) {
          setgetteacher_type(teacher_type_wed_aft_t4)

        }
        if (teacher_type_thu_mor_t1) {
          setgetteacher_type(teacher_type_thu_mor_t1)

        }
        if (teacher_type_thu_mor_t2) {
          setgetteacher_type(teacher_type_thu_mor_t2)

        }
        if (teacher_type_thu_mor_t3) {
          setgetteacher_type(teacher_type_thu_mor_t3)

        }
        if (teacher_type_thu_mor_t4) {
          setgetteacher_type(teacher_type_thu_mor_t4)

        }
        if (teacher_type_thu_aft_t1) {
          setgetteacher_type(teacher_type_thu_aft_t1)

        }
        if (teacher_type_thu_aft_t2) {
          setgetteacher_type(teacher_type_thu_aft_t2)

        }
        if (teacher_type_thu_aft_t3) {
          setgetteacher_type(teacher_type_thu_aft_t3)

        }
        if (teacher_type_thu_aft_t4) {
          setgetteacher_type(teacher_type_thu_aft_t4)

        }
        if (teacher_type_fri_mor_t1) {
          setgetteacher_type(teacher_type_fri_mor_t1)

        }
        if (teacher_type_fri_mor_t2) {
          setgetteacher_type(teacher_type_fri_mor_t2)

        }
        if (teacher_type_fri_mor_t3) {
          setgetteacher_type(teacher_type_fri_mor_t3)

        }
        if (teacher_type_fri_mor_t4) {
          setgetteacher_type(teacher_type_fri_mor_t4)

        }
        if (teacher_type_fri_aft_t1) {
          setgetteacher_type(teacher_type_fri_aft_t1)

        }
        if (teacher_type_fri_aft_t2) {
          setgetteacher_type(teacher_type_fri_aft_t2)

        }
        if (teacher_type_fri_aft_t3) {
          setgetteacher_type(teacher_type_fri_aft_t3)

        }
        if (teacher_type_fri_aft_t4) {
          setgetteacher_type(teacher_type_fri_aft_t4)

        }
      } else {
        setgetteacher_type('')
        setgetT_grade('')
        setuser_nick('')
        user_id.current.value = null
        user_img.current.value = null
        // getT_grade.current.value = null
        // set_user_sub.current.value = 'ជ្រើសរើសមុខវិជ្ជា'

      }
    }

    return (
      <>
        {mainData.map((d, index) => (
          <tr>
            <th>{index + 1}</th>
            <th data-bs-toggle="modal" data-bs-target="#forPreview"
              data-sub_mon_mor_t1={d.sub_mon_mor_t1}
              data-sub_mon_mor_t2={d.sub_mon_mor_t2}
              data-sub_mon_mor_t3={d.sub_mon_mor_t3}
              data-sub_mon_mor_t4={d.sub_mon_mor_t4}
              data-tname_mon_mor_t1={d.tname_mon_mor_t1}
              data-tname_mon_mor_t2={d.tname_mon_mor_t2}
              data-tname_mon_mor_t3={d.tname_mon_mor_t3}
              data-tname_mon_mor_t4={d.tname_mon_mor_t4}
              data-sub_mon_aft_t1={d.sub_mon_aft_t1}
              data-sub_mon_aft_t2={d.sub_mon_aft_t2}
              data-sub_mon_aft_t3={d.sub_mon_aft_t3}
              data-sub_mon_aft_t4={d.sub_mon_aft_t4}
              data-tname_mon_aft_t1={d.tname_mon_aft_t1}
              data-tname_mon_aft_t2={d.tname_mon_aft_t2}
              data-tname_mon_aft_t3={d.tname_mon_aft_t3}
              data-tname_mon_aft_t4={d.tname_mon_aft_t4}
              data-sub_tue_mor_t1={d.sub_tue_mor_t1}
              data-sub_tue_mor_t2={d.sub_tue_mor_t2}
              data-sub_tue_mor_t3={d.sub_tue_mor_t3}
              data-sub_tue_mor_t4={d.sub_tue_mor_t4}
              data-tname_tue_mor_t1={d.tname_tue_mor_t1}
              data-tname_tue_mor_t2={d.tname_tue_mor_t2}
              data-tname_tue_mor_t3={d.tname_tue_mor_t3}
              data-tname_tue_mor_t4={d.tname_tue_mor_t4}
              data-sub_tue_aft_t1={d.sub_tue_aft_t1}
              data-sub_tue_aft_t2={d.sub_tue_aft_t2}
              data-sub_tue_aft_t3={d.sub_tue_aft_t3}
              data-sub_tue_aft_t4={d.sub_tue_aft_t4}
              data-tname_tue_aft_t1={d.tname_tue_aft_t1}
              data-tname_tue_aft_t2={d.tname_tue_aft_t2}
              data-tname_tue_aft_t3={d.tname_tue_aft_t3}
              data-tname_tue_aft_t4={d.tname_tue_aft_t4}
              data-sub_wed_mor_t1={d.sub_wed_mor_t1}
              data-sub_wed_mor_t2={d.sub_wed_mor_t2}
              data-sub_wed_mor_t3={d.sub_wed_mor_t3}
              data-sub_wed_mor_t4={d.sub_wed_mor_t4}
              data-tname_wed_mor_t1={d.tname_wed_mor_t1}
              data-tname_wed_mor_t2={d.tname_wed_mor_t2}
              data-tname_wed_mor_t3={d.tname_wed_mor_t3}
              data-tname_wed_mor_t4={d.tname_wed_mor_t4}
              data-sub_wed_aft_t1={d.sub_wed_aft_t1}
              data-sub_wed_aft_t2={d.sub_wed_aft_t2}
              data-sub_wed_aft_t3={d.sub_wed_aft_t3}
              data-sub_wed_aft_t4={d.sub_wed_aft_t4}
              data-tname_wed_aft_t1={d.tname_wed_aft_t1}
              data-tname_wed_aft_t2={d.tname_wed_aft_t2}
              data-tname_wed_aft_t3={d.tname_wed_aft_t3}
              data-tname_wed_aft_t4={d.tname_wed_aft_t4}
              data-sub_thu_mor_t1={d.sub_thu_mor_t1}
              data-sub_thu_mor_t2={d.sub_thu_mor_t2}
              data-sub_thu_mor_t3={d.sub_thu_mor_t3}
              data-sub_thu_mor_t4={d.sub_thu_mor_t4}
              data-tname_thu_mor_t1={d.tname_thu_mor_t1}
              data-tname_thu_mor_t2={d.tname_thu_mor_t2}
              data-tname_thu_mor_t3={d.tname_thu_mor_t3}
              data-tname_thu_mor_t4={d.tname_thu_mor_t4}
              data-sub_thu_aft_t1={d.sub_thu_aft_t1}
              data-sub_thu_aft_t2={d.sub_thu_aft_t2}
              data-sub_thu_aft_t3={d.sub_thu_aft_t3}
              data-sub_thu_aft_t4={d.sub_thu_aft_t4}
              data-tname_thu_aft_t1={d.tname_thu_aft_t1}
              data-tname_thu_aft_t2={d.tname_thu_aft_t2}
              data-tname_thu_aft_t3={d.tname_thu_aft_t3}
              data-tname_thu_aft_t4={d.tname_thu_aft_t4}
              data-sub_fri_mor_t1={d.sub_fri_mor_t1}
              data-sub_fri_mor_t2={d.sub_fri_mor_t2}
              data-sub_fri_mor_t3={d.sub_fri_mor_t3}
              data-sub_fri_mor_t4={d.sub_fri_mor_t4}
              data-tname_fri_mor_t1={d.tname_fri_mor_t1}
              data-tname_fri_mor_t2={d.tname_fri_mor_t2}
              data-tname_fri_mor_t3={d.tname_fri_mor_t3}
              data-tname_fri_mor_t4={d.tname_fri_mor_t4}
              data-sub_fri_aft_t1={d.sub_fri_aft_t1}
              data-sub_fri_aft_t2={d.sub_fri_aft_t2}
              data-sub_fri_aft_t3={d.sub_fri_aft_t3}
              data-sub_fri_aft_t4={d.sub_fri_aft_t4}
              data-tname_fri_aft_t1={d.tname_fri_aft_t1}
              data-tname_fri_aft_t2={d.tname_fri_aft_t2}
              data-tname_fri_aft_t3={d.tname_fri_aft_t3}
              data-tname_fri_aft_t4={d.tname_fri_aft_t4}
              data-t_grade_mon_mor_t1={d.t_grade_mon_mor_t1}
              data-t_grade_mon_mor_t2={d.t_grade_mon_mor_t2}
              data-t_grade_mon_mor_t3={d.t_grade_mon_mor_t3}
              data-t_grade_mon_mor_t4={d.t_grade_mon_mor_t4}
              data-t_grade_mon_aft_t1={d.t_grade_mon_aft_t1}
              data-t_grade_mon_aft_t2={d.t_grade_mon_aft_t2}
              data-t_grade_mon_aft_t3={d.t_grade_mon_aft_t3}
              data-t_grade_mon_aft_t4={d.t_grade_mon_aft_t4}
              data-t_grade_tue_mor_t1={d.t_grade_tue_mor_t1}
              data-t_grade_tue_mor_t2={d.t_grade_tue_mor_t2}
              data-t_grade_tue_mor_t3={d.t_grade_tue_mor_t3}
              data-t_grade_tue_mor_t4={d.t_grade_tue_mor_t4}
              data-t_grade_tue_aft_t1={d.t_grade_tue_aft_t1}
              data-t_grade_tue_aft_t2={d.t_grade_tue_aft_t2}
              data-t_grade_tue_aft_t3={d.t_grade_tue_aft_t3}
              data-t_grade_tue_aft_t4={d.t_grade_tue_aft_t4}
              data-t_grade_wed_mor_t1={d.t_grade_wed_mor_t1}
              data-t_grade_wed_mor_t2={d.t_grade_wed_mor_t2}
              data-t_grade_wed_mor_t3={d.t_grade_wed_mor_t3}
              data-t_grade_wed_mor_t4={d.t_grade_wed_mor_t4}
              data-t_grade_wed_aft_t1={d.t_grade_wed_aft_t1}
              data-t_grade_wed_aft_t2={d.t_grade_wed_aft_t2}
              data-t_grade_wed_aft_t3={d.t_grade_wed_aft_t3}
              data-t_grade_wed_aft_t4={d.t_grade_wed_aft_t4}
              data-t_grade_thu_mor_t1={d.t_grade_thu_mor_t1}
              data-t_grade_thu_mor_t2={d.t_grade_thu_mor_t2}
              data-t_grade_thu_mor_t3={d.t_grade_thu_mor_t3}
              data-t_grade_thu_mor_t4={d.t_grade_thu_mor_t4}
              data-t_grade_thu_aft_t1={d.t_grade_thu_aft_t1}
              data-t_grade_thu_aft_t2={d.t_grade_thu_aft_t2}
              data-t_grade_thu_aft_t3={d.t_grade_thu_aft_t3}
              data-t_grade_thu_aft_t4={d.t_grade_thu_aft_t4}
              data-t_grade_fri_mor_t1={d.t_grade_fri_mor_t1}
              data-t_grade_fri_mor_t2={d.t_grade_fri_mor_t2}
              data-t_grade_fri_mor_t3={d.t_grade_fri_mor_t3}
              data-t_grade_fri_mor_t4={d.t_grade_fri_mor_t4}
              data-t_grade_fri_aft_t1={d.t_grade_fri_aft_t1}
              data-t_grade_fri_aft_t2={d.t_grade_fri_aft_t2}
              data-t_grade_fri_aft_t3={d.t_grade_fri_aft_t3}
              data-t_grade_fri_aft_t4={d.t_grade_fri_aft_t4}
              data-teacher_type_mon_mor_t1={d.teacher_type_mon_mor_t1}
              data-teacher_type_mon_mor_t2={d.teacher_type_mon_mor_t2}
              data-teacher_type_mon_mor_t3={d.teacher_type_mon_mor_t3}
              data-teacher_type_mon_mor_t4={d.teacher_type_mon_mor_t4}
              data-teacher_type_mon_aft_t1={d.teacher_type_mon_aft_t1}
              data-teacher_type_mon_aft_t2={d.teacher_type_mon_aft_t2}
              data-teacher_type_mon_aft_t3={d.teacher_type_mon_aft_t3}
              data-teacher_type_mon_aft_t4={d.teacher_type_mon_aft_t4}
              data-teacher_type_tue_mor_t1={d.teacher_type_tue_mor_t1}
              data-teacher_type_tue_mor_t2={d.teacher_type_tue_mor_t2}
              data-teacher_type_tue_mor_t3={d.teacher_type_tue_mor_t3}
              data-teacher_type_tue_mor_t4={d.teacher_type_tue_mor_t4}
              data-teacher_type_tue_aft_t1={d.teacher_type_tue_aft_t1}
              data-teacher_type_tue_aft_t2={d.teacher_type_tue_aft_t2}
              data-teacher_type_tue_aft_t3={d.teacher_type_tue_aft_t3}
              data-teacher_type_tue_aft_t4={d.teacher_type_tue_aft_t4}
              data-teacher_type_wed_mor_t1={d.teacher_type_wed_mor_t1}
              data-teacher_type_wed_mor_t2={d.teacher_type_wed_mor_t2}
              data-teacher_type_wed_mor_t3={d.teacher_type_wed_mor_t3}
              data-teacher_type_wed_mor_t4={d.teacher_type_wed_mor_t4}
              data-teacher_type_wed_aft_t1={d.teacher_type_wed_aft_t1}
              data-teacher_type_wed_aft_t2={d.teacher_type_wed_aft_t2}
              data-teacher_type_wed_aft_t3={d.teacher_type_wed_aft_t3}
              data-teacher_type_wed_aft_t4={d.teacher_type_wed_aft_t4}
              data-teacher_type_thu_mor_t1={d.teacher_type_thu_mor_t1}
              data-teacher_type_thu_mor_t2={d.teacher_type_thu_mor_t2}
              data-teacher_type_thu_mor_t3={d.teacher_type_thu_mor_t3}
              data-teacher_type_thu_mor_t4={d.teacher_type_thu_mor_t4}
              data-teacher_type_thu_aft_t1={d.teacher_type_thu_aft_t1}
              data-teacher_type_thu_aft_t2={d.teacher_type_thu_aft_t2}
              data-teacher_type_thu_aft_t3={d.teacher_type_thu_aft_t3}
              data-teacher_type_thu_aft_t4={d.teacher_type_thu_aft_t4}
              data-teacher_type_fri_mor_t1={d.teacher_type_fri_mor_t1}
              data-teacher_type_fri_mor_t2={d.teacher_type_fri_mor_t2}
              data-teacher_type_fri_mor_t3={d.teacher_type_fri_mor_t3}
              data-teacher_type_fri_mor_t4={d.teacher_type_fri_mor_t4}
              data-teacher_type_fri_aft_t1={d.teacher_type_fri_aft_t1}
              data-teacher_type_fri_aft_t2={d.teacher_type_fri_aft_t2}
              data-teacher_type_fri_aft_t3={d.teacher_type_fri_aft_t3}
              data-teacher_type_fri_aft_t4={d.teacher_type_fri_aft_t4}
              data-myid={d.id}
              data-headteacher={d.head_teacher}
              onClick={getID}
              id={d.id + "pre"}
            >{d.id}</th>
            <th></th>
            <td
              data-nickname={d.nickname_mon_mor_t1}
              data-id={d.tname_mon_mor_t1}
              data-img={d.img_mon_mor_t1}
              data-sub={d.sub_mon_mor_t1}
              data-t_grade_mon_mor_t1={d.t_grade_mon_mor_t1}
              data-teacher_type_mon_mor_t1={d.teacher_type_mon_mor_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell1'}
              onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr1" ref={user_sub} data-t={d.tname_mon_mor_t1}>{d.sub_mon_mor_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_mor_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_mon_mor_t2}
              data-id={d.tname_mon_mor_t2}
              data-img={d.img_mon_mor_t2}
              data-sub={d.sub_mon_mor_t2}
              data-t_grade_mon_mor_t2={d.t_grade_mon_mor_t2}
              data-teacher_type_mon_mor_t2={d.teacher_type_mon_mor_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell2'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr2" ref={user_sub} data-t={d.tname_mon_mor_t2}>{d.sub_mon_mor_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_mor_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_mon_mor_t3}
              data-id={d.tname_mon_mor_t3}
              data-img={d.img_mon_mor_t3}
              data-sub={d.sub_mon_mor_t3}
              data-t_grade_mon_mor_t3={d.t_grade_mon_mor_t3}
              data-teacher_type_mon_mor_t3={d.teacher_type_mon_mor_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell3'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr3" ref={user_sub} data-t={d.tname_mon_mor_t3}>{d.sub_mon_mor_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_mor_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_mon_mor_t4}
              data-id={d.tname_mon_mor_t4}
              data-img={d.img_mon_mor_t4}
              data-sub={d.sub_mon_mor_t4}
              data-t_grade_mon_mor_t4={d.t_grade_mon_mor_t4}
              data-teacher_type_mon_mor_t4={d.teacher_type_mon_mor_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell4'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr4" ref={user_sub} data-t={d.tname_mon_mor_t4}>{d.sub_mon_mor_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_mor_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_mon_aft_t1}
              data-id={d.tname_mon_aft_t1}
              data-img={d.img_mon_aft_t1}
              data-sub={d.sub_mon_aft_t1}
              data-t_grade_mon_aft_t1={d.t_grade_mon_aft_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell5'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr5" ref={user_sub} data-t={d.tname_mon_aft_t1}>{d.sub_mon_aft_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_aft_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_mon_aft_t2}
              data-id={d.tname_mon_aft_t2}
              data-img={d.img_mon_aft_t2}
              data-sub={d.sub_mon_aft_t2}
              data-t_grade_mon_aft_t2={d.t_grade_mon_aft_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell6'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr6" ref={user_sub} data-t={d.tname_mon_aft_t2}>{d.sub_mon_aft_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_aft_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_mon_aft_t3}
              data-id={d.tname_mon_aft_t3}
              data-img={d.img_mon_aft_t3}
              data-sub={d.sub_mon_aft_t3}
              data-t_grade_mon_aft_t3={d.t_grade_mon_aft_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell7'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr7" ref={user_sub} data-t={d.tname_mon_aft_t3}>{d.sub_mon_aft_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_aft_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_mon_aft_t4}
              data-id={d.tname_mon_aft_t4}
              data-img={d.img_mon_aft_t4}
              data-sub={d.sub_mon_aft_t4}
              data-t_grade_mon_aft_t4={d.t_grade_mon_aft_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell8'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr8" ref={user_sub} data-t={d.tname_mon_aft_t4}>{d.sub_mon_aft_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_mon_aft_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_mor_t1}
              data-id={d.tname_tue_mor_t1}
              data-img={d.img_tue_mor_t1}
              data-sub={d.sub_tue_mor_t1}
              data-t_grade_tue_mor_t1={d.t_grade_tue_mor_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell9'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr9" ref={user_sub} data-t={d.tname_tue_mor_t1}>{d.sub_tue_mor_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_mor_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_mor_t2}
              data-id={d.tname_tue_mor_t2}
              data-img={d.img_tue_mor_t2}
              data-sub={d.sub_tue_mor_t2}
              data-t_grade_tue_mor_t2={d.t_grade_tue_mor_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell10'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr10" ref={user_sub} data-t={d.tname_tue_mor_t2}>{d.sub_tue_mor_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_mor_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_mor_t3}
              data-id={d.tname_tue_mor_t3}
              data-img={d.img_tue_mor_t3}
              data-sub={d.sub_tue_mor_t3}
              data-t_grade_tue_mor_t3={d.t_grade_tue_mor_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell11'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr11" ref={user_sub} data-t={d.tname_tue_mor_t3}>{d.sub_tue_mor_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_mor_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_mor_t4}
              data-id={d.tname_tue_mor_t4}
              data-img={d.img_tue_mor_t4}
              data-sub={d.sub_tue_mor_t4}
              data-t_grade_tue_mor_t4={d.t_grade_tue_mor_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell12'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr12" ref={user_sub} data-t={d.tname_tue_mor_t4}>{d.sub_tue_mor_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_mor_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_aft_t1}
              data-id={d.tname_tue_aft_t1}
              data-img={d.img_tue_aft_t1}
              data-sub={d.sub_tue_aft_t1}
              data-t_grade_tue_aft_t1={d.t_grade_tue_aft_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell13'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr13" ref={user_sub} data-t={d.tname_tue_aft_t1}>{d.sub_tue_aft_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_aft_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_aft_t2}
              data-id={d.tname_tue_aft_t2}
              data-img={d.img_tue_aft_t2}
              data-sub={d.sub_tue_aft_t2}
              data-t_grade_tue_aft_t2={d.t_grade_tue_aft_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell14'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr14" ref={user_sub} data-t={d.tname_tue_aft_t2}>{d.sub_tue_aft_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_aft_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_aft_t3}
              data-id={d.tname_tue_aft_t3}
              data-img={d.img_tue_aft_t3}
              data-sub={d.sub_tue_aft_t3}
              data-t_grade_tue_aft_t3={d.t_grade_tue_aft_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell15'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr15" ref={user_sub} data-t={d.tname_tue_aft_t3}>{d.sub_tue_aft_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_aft_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_tue_aft_t4}
              data-id={d.tname_tue_aft_t4}
              data-img={d.img_tue_aft_t4}
              data-sub={d.sub_tue_aft_t4}
              data-t_grade_tue_aft_t4={d.t_grade_tue_aft_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell16'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr16" ref={user_sub} data-t={d.tname_tue_aft_t4}>{d.sub_tue_aft_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_tue_aft_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_mor_t1}
              data-id={d.tname_wed_mor_t1}
              data-img={d.img_wed_mor_t1}
              data-sub={d.sub_wed_mor_t1}
              data-t_grade_wed_mor_t1={d.t_grade_wed_mor_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell17'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr17" ref={user_sub} data-t={d.tname_wed_mor_t1}>{d.sub_wed_mor_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_mor_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_mor_t2}
              data-id={d.tname_wed_mor_t2}
              data-img={d.img_wed_mor_t2}
              data-sub={d.sub_wed_mor_t2}
              data-t_grade_wed_mor_t2={d.t_grade_wed_mor_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell18'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr18" ref={user_sub} data-t={d.tname_wed_mor_t2}>{d.sub_wed_mor_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_mor_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_mor_t3}
              data-id={d.tname_wed_mor_t3}
              data-img={d.img_wed_mor_t3}
              data-sub={d.sub_wed_mor_t3}
              data-t_grade_wed_mor_t3={d.t_grade_wed_mor_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell19'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr19" ref={user_sub} data-t={d.tname_wed_mor_t3}>{d.sub_wed_mor_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_mor_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_mor_t4}
              data-id={d.tname_wed_mor_t4}
              data-img={d.img_wed_mor_t4}
              data-sub={d.sub_wed_mor_t4}
              data-t_grade_wed_mor_t4={d.t_grade_wed_mor_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell20'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr20" ref={user_sub} data-t={d.tname_wed_mor_t4}>{d.sub_wed_mor_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_mor_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_aft_t1}
              data-id={d.tname_wed_aft_t1}
              data-img={d.img_wed_aft_t1}
              data-sub={d.sub_wed_aft_t1}
              data-t_grade_wed_aft_t1={d.t_grade_wed_aft_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell21'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr21" ref={user_sub} data-t={d.tname_wed_aft_t1}>{d.sub_wed_aft_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_aft_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_aft_t2}
              data-id={d.tname_wed_aft_t2}
              data-img={d.img_wed_aft_t2}
              data-sub={d.sub_wed_aft_t2}
              data-t_grade_wed_aft_t2={d.t_grade_wed_aft_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell22'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr22" ref={user_sub} data-t={d.tname_wed_aft_t2}>{d.sub_wed_aft_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_aft_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_aft_t3}
              data-id={d.tname_wed_aft_t3}
              data-img={d.img_wed_aft_t3}
              data-sub={d.sub_wed_aft_t3}
              data-t_grade_wed_aft_t3={d.t_grade_wed_aft_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell23'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr23" ref={user_sub} data-t={d.tname_wed_aft_t3}>{d.sub_wed_aft_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_aft_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_wed_aft_t4}
              data-id={d.tname_wed_aft_t4}
              data-img={d.img_wed_aft_t4}
              data-sub={d.sub_wed_aft_t4}
              data-t_grade_wed_aft_t4={d.t_grade_wed_aft_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell24'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr24" ref={user_sub} data-t={d.tname_wed_aft_t4}>{d.sub_wed_aft_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_wed_aft_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_mor_t1}
              data-id={d.tname_thu_mor_t1}
              data-img={d.img_thu_mor_t1}
              data-sub={d.sub_thu_mor_t1}
              data-t_grade_thu_mor_t1={d.t_grade_thu_mor_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell25'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr25" ref={user_sub} data-t={d.tname_thu_mor_t1}>{d.sub_thu_mor_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_mor_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_mor_t2}
              data-id={d.tname_thu_mor_t2}
              data-img={d.img_thu_mor_t2}
              data-sub={d.sub_thu_mor_t2}
              data-t_grade_thu_mor_t2={d.t_grade_thu_mor_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell26'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr26" ref={user_sub} data-t={d.tname_thu_mor_t2}>{d.sub_thu_mor_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_mor_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_mor_t3}
              data-id={d.tname_thu_mor_t3}
              data-img={d.img_thu_mor_t3}
              data-sub={d.sub_thu_mor_t3}
              data-t_grade_thu_mor_t3={d.t_grade_thu_mor_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell27'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr27" ref={user_sub} data-t={d.tname_thu_mor_t3}>{d.sub_thu_mor_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_mor_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_mor_t4}
              data-id={d.tname_thu_mor_t4}
              data-img={d.img_thu_mor_t4}
              data-sub={d.sub_thu_mor_t4}
              data-t_grade_thu_mor_t4={d.t_grade_thu_mor_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell28'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr28" ref={user_sub} data-t={d.tname_thu_mor_t4}>{d.sub_thu_mor_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_mor_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_aft_t1}
              data-id={d.tname_thu_aft_t1}
              data-img={d.img_thu_aft_t1}
              data-sub={d.sub_thu_aft_t1}
              data-t_grade_thu_aft_t1={d.t_grade_thu_aft_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell29'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr29" ref={user_sub} data-t={d.tname_thu_aft_t1}>{d.sub_thu_aft_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_aft_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_aft_t2}
              data-id={d.tname_thu_aft_t2}
              data-img={d.img_thu_aft_t2}
              data-sub={d.sub_thu_aft_t2}
              data-t_grade_thu_aft_t2={d.t_grade_thu_aft_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell30'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr30" ref={user_sub} data-t={d.tname_thu_aft_t2}>{d.sub_thu_aft_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_aft_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_aft_t3}
              data-id={d.tname_thu_aft_t3}
              data-img={d.img_thu_aft_t3}
              data-sub={d.sub_thu_aft_t3}
              data-t_grade_thu_aft_t3={d.t_grade_thu_aft_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell31'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr31" ref={user_sub} data-t={d.tname_thu_aft_t3}>{d.sub_thu_aft_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_aft_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_thu_aft_t4}
              data-id={d.tname_thu_aft_t4}
              data-img={d.img_thu_aft_t4}
              data-sub={d.sub_thu_aft_t4}
              data-t_grade_thu_aft_t4={d.t_grade_thu_aft_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell32'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr32" ref={user_sub} data-t={d.tname_thu_aft_t4}>{d.sub_thu_aft_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_thu_aft_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_mor_t1}
              data-id={d.tname_fri_mor_t1}
              data-img={d.img_fri_mor_t1}
              data-sub={d.sub_fri_mor_t1}
              data-t_grade_fri_mor_t1={d.t_grade_fri_mor_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell33'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr33" ref={user_sub} data-t={d.tname_fri_mor_t1}>{d.sub_fri_mor_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_mor_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_mor_t2}
              data-id={d.tname_fri_mor_t2}
              data-img={d.img_fri_mor_t2}
              data-sub={d.sub_fri_mor_t2}
              data-t_grade_fri_mor_t2={d.t_grade_fri_mor_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell34'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr34" ref={user_sub} data-t={d.tname_fri_mor_t2}>{d.sub_fri_mor_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_mor_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_mor_t3}
              data-id={d.tname_fri_mor_t3}
              data-img={d.img_fri_mor_t3}
              data-sub={d.sub_fri_mor_t3}
              data-t_grade_fri_mor_t3={d.t_grade_fri_mor_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell35'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr35" ref={user_sub} data-t={d.tname_fri_mor_t3}>{d.sub_fri_mor_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_mor_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_mor_t4}
              data-id={d.tname_fri_mor_t4}
              data-img={d.img_fri_mor_t4}
              data-sub={d.sub_fri_mor_t4}
              data-t_grade_fri_mor_t4={d.t_grade_fri_mor_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell36'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr36" ref={user_sub} data-t={d.tname_fri_mor_t4}>{d.sub_fri_mor_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_mor_t4}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_aft_t1}
              data-id={d.tname_fri_aft_t1}
              data-img={d.img_fri_aft_t1}
              data-sub={d.sub_fri_aft_t1}
              data-t_grade_fri_aft_t1={d.t_grade_fri_aft_t1}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell37'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr37" ref={user_sub} data-t={d.tname_fri_aft_t1}>{d.sub_fri_aft_t1}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_aft_t1}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_aft_t2}
              data-id={d.tname_fri_aft_t2}
              data-img={d.img_fri_aft_t2}
              data-sub={d.sub_fri_aft_t2}
              data-t_grade_fri_aft_t2={d.t_grade_fri_aft_t2}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell38'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr38" ref={user_sub} data-t={d.tname_fri_aft_t2}>{d.sub_fri_aft_t2}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_aft_t2}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_aft_t3}
              data-id={d.tname_fri_aft_t3}
              data-img={d.img_fri_aft_t3}
              data-sub={d.sub_fri_aft_t3}
              data-t_grade_fri_aft_t3={d.t_grade_fri_aft_t3}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell39'}
              // onClick={selectData}

            >
              <div className="cell-content">
                <span class="tr39" ref={user_sub} data-t={d.tname_fri_aft_t3}>{d.sub_fri_aft_t3}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_aft_t3}
                  width="20" height="20" />
              </div>
            </td>
            <td
              data-nickname={d.nickname_fri_aft_t4}
              data-id={d.tname_fri_aft_t4}
              data-img={d.img_fri_aft_t4}
              data-sub={d.sub_fri_aft_t4}
              data-t_grade_fri_aft_t4={d.t_grade_fri_aft_t4}
              data-g={d.clEn.replace(/^0+/, '')}
              data-cell={'cell40'}
              // onClick={selectData}
            >
              <div className="cell-content">
                <span class="tr40" ref={user_sub} data-t={d.tname_fri_aft_t4}>{d.sub_fri_aft_t4}</span>
                <img class="img-circle" onError={handleImageError}
                  src={d.img_fri_aft_t4}
                  width="20" height="20" />
              </div>
            </td>

          </tr>
        ))}
      </>
    )
  }

  const setTimeTable = (e) => {
    const db = getDatabase();
    const id = user_id.current.value
    const imgUrl = user_img.current.value
    const nickname = user_nick
    const subs = set_user_sub.current.value
    const grade = user_g
    if (data_cell === 'cell1') {
      if (data_row_1.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          t_grade_mon_mor_t1: getT_grade,
          teacher_type_mon_mor_t1: getteacher_type,
          nickname_mon_mor_t1: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });

        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_mor_t1: grade,
            img_mon_mor_t1: imgUrl,
            sub_mon_mor_t1: subs,
            tname_mon_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_mor_t1: grade,
            img_mon_mor_t1: imgUrl,
            sub_mon_mor_t1: subs,
            tname_mon_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t1: grade,
            img_mon_mor_t1: imgUrl,
            sub_mon_mor_t1: subs,
            tname_mon_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell2') {
      if (data_row_2.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          t_grade_mon_mor_t2: getT_grade,
          teacher_type_mon_mor_t2: getteacher_type,
          nickname_mon_mor_t2: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_mor_t2: grade,
            img_mon_mor_t2: imgUrl,
            sub_mon_mor_t2: subs,
            tname_mon_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_mor_t2: grade,
            img_mon_mor_t2: imgUrl,
            sub_mon_mor_t2: subs,
            tname_mon_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t2: grade,
            img_mon_mor_t2: imgUrl,
            sub_mon_mor_t2: subs,
            tname_mon_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell3') {
      if (data_row_3.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          t_grade_mon_mor_t3: getT_grade,
          teacher_type_mon_mor_t3: getteacher_type,
          nickname_mon_mor_t3: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_mor_t3: grade,
            img_mon_mor_t3: imgUrl,
            sub_mon_mor_t3: subs,
            tname_mon_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_mor_t3: grade,
            img_mon_mor_t3: imgUrl,
            sub_mon_mor_t3: subs,
            tname_mon_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t3: grade,
            img_mon_mor_t3: imgUrl,
            sub_mon_mor_t3: subs,
            tname_mon_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell4') {
      if (data_row_4.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          t_grade_mon_mor_t4: getT_grade,
          teacher_type_mon_mor_t4: getteacher_type,
          nickname_mon_mor_t4: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_mor_t4: grade,
            img_mon_mor_t4: imgUrl,
            sub_mon_mor_t4: subs,
            tname_mon_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_mor_t4: grade,
            img_mon_mor_t4: imgUrl,
            sub_mon_mor_t4: subs,
            tname_mon_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t4: grade,
            img_mon_mor_t4: imgUrl,
            sub_mon_mor_t4: subs,
            tname_mon_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell5') {
      if (data_row_5.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          t_grade_mon_aft_t1: getT_grade,
          teacher_type_mon_aft_t1: getteacher_type,
          nickname_mon_aft_t1: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_aft_t1: grade,
            img_mon_aft_t1: imgUrl,
            sub_mon_aft_t1: subs,
            tname_mon_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_aft_t1: grade,
            img_mon_aft_t1: imgUrl,
            sub_mon_aft_t1: subs,
            tname_mon_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t1: grade,
            img_mon_aft_t1: imgUrl,
            sub_mon_aft_t1: subs,
            tname_mon_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell6') {
      if (data_row_6.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          t_grade_mon_aft_t2: getT_grade,
          teacher_type_mon_aft_t2: getteacher_type,
          nickname_mon_aft_t2: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_aft_t2: grade,
            img_mon_aft_t2: imgUrl,
            sub_mon_aft_t2: subs,
            tname_mon_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_aft_t2: grade,
            img_mon_aft_t2: imgUrl,
            sub_mon_aft_t2: subs,
            tname_mon_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t2: grade,
            img_mon_aft_t2: imgUrl,
            sub_mon_aft_t2: subs,
            tname_mon_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell7') {
      if (data_row_7.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          t_grade_mon_aft_t3: getT_grade,
          teacher_type_mon_aft_t3: getteacher_type,
          nickname_mon_aft_t3: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_aft_t3: grade,
            img_mon_aft_t3: imgUrl,
            sub_mon_aft_t3: subs,
            tname_mon_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_aft_t3: grade,
            img_mon_aft_t3: imgUrl,
            sub_mon_aft_t3: subs,
            tname_mon_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t3: grade,
            img_mon_aft_t3: imgUrl,
            sub_mon_aft_t3: subs,
            tname_mon_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell8') {
      if (data_row_8.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          t_grade_mon_aft_t4: getT_grade,
          teacher_type_mon_aft_t4: getteacher_type,
          nickname_mon_aft_t4: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_mon_aft_t4: grade,
            img_mon_aft_t4: imgUrl,
            sub_mon_aft_t4: subs,
            tname_mon_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_mon_aft_t4: grade,
            img_mon_aft_t4: imgUrl,
            sub_mon_aft_t4: subs,
            tname_mon_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t4: grade,
            img_mon_aft_t4: imgUrl,
            sub_mon_aft_t4: subs,
            tname_mon_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell9') {
      if (data_row_9.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          t_grade_tue_mor_t1: getT_grade,
          teacher_type_tue_mor_t1: getteacher_type,
          nickname_tue_mor_t1: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_mor_t1: grade,
            img_tue_mor_t1: imgUrl,
            sub_tue_mor_t1: subs,
            tname_tue_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_mor_t1: grade,
            img_tue_mor_t1: imgUrl,
            sub_tue_mor_t1: subs,
            tname_tue_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t1: grade,
            img_tue_mor_t1: imgUrl,
            sub_tue_mor_t1: subs,
            tname_tue_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell10') {
      if (data_row_10.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          t_grade_tue_mor_t2: getT_grade,
          teacher_type_tue_mor_t2: getteacher_type,
          nickname_tue_mor_t2: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_mor_t2: grade,
            img_tue_mor_t2: imgUrl,
            sub_tue_mor_t2: subs,
            tname_tue_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_mor_t2: grade,
            img_tue_mor_t2: imgUrl,
            sub_tue_mor_t2: subs,
            tname_tue_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t2: grade,
            img_tue_mor_t2: imgUrl,
            sub_tue_mor_t2: subs,
            tname_tue_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell11') {
      if (data_row_11.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          t_grade_tue_mor_t3: getT_grade,
          teacher_type_tue_mor_t3: getteacher_type,
          nickname_tue_mor_t3: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_mor_t3: grade,
            img_tue_mor_t3: imgUrl,
            sub_tue_mor_t3: subs,
            tname_tue_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_mor_t3: grade,
            img_tue_mor_t3: imgUrl,
            sub_tue_mor_t3: subs,
            tname_tue_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });

        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t3: grade,
            img_tue_mor_t3: imgUrl,
            sub_tue_mor_t3: subs,
            tname_tue_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell12') {
      if (data_row_12.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          t_grade_tue_mor_t4: getT_grade,
          teacher_type_tue_mor_t4: getteacher_type,
          nickname_tue_mor_t4: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_mor_t4: grade,
            img_tue_mor_t4: imgUrl,
            sub_tue_mor_t4: subs,
            tname_tue_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_mor_t4: grade,
            img_tue_mor_t4: imgUrl,
            sub_tue_mor_t4: subs,
            tname_tue_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t4: grade,
            img_tue_mor_t4: imgUrl,
            sub_tue_mor_t4: subs,
            tname_tue_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell13') {
      if (data_row_13.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          t_grade_tue_aft_t1: getT_grade,
          teacher_type_tue_aft_t1: getteacher_type,
          nickname_tue_aft_t1: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_aft_t1: grade,
            img_tue_aft_t1: imgUrl,
            sub_tue_aft_t1: subs,
            tname_tue_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_aft_t1: grade,
            img_tue_aft_t1: imgUrl,
            sub_tue_aft_t1: subs,
            tname_tue_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t1: grade,
            img_tue_aft_t1: imgUrl,
            sub_tue_aft_t1: subs,
            tname_tue_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell14') {
      if (data_row_14.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          t_grade_tue_aft_t2: getT_grade,
          teacher_type_tue_aft_t2: getteacher_type,
          nickname_tue_aft_t2: user_nick,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_aft_t2: grade,
            img_tue_aft_t2: imgUrl,
            sub_tue_aft_t2: subs,
            tname_tue_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_aft_t2: grade,
            img_tue_aft_t2: imgUrl,
            sub_tue_aft_t2: subs,
            tname_tue_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t2: grade,
            img_tue_aft_t2: imgUrl,
            sub_tue_aft_t2: subs,
            tname_tue_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell15') {
      if (data_row_15.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_aft_t3: grade,
          img_tue_aft_t3: imgUrl,
          sub_tue_aft_t3: subs,
          tname_tue_aft_t3: id,
          t_grade_tue_aft_t3: getT_grade,
          teacher_type_tue_aft_t3: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_aft_t3: grade,
          img_tue_aft_t3: imgUrl,
          sub_tue_aft_t3: subs,
          tname_tue_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_aft_t3: grade,
            img_tue_aft_t3: imgUrl,
            sub_tue_aft_t3: subs,
            tname_tue_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_aft_t3: grade,
            img_tue_aft_t3: imgUrl,
            sub_tue_aft_t3: subs,
            tname_tue_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t3: grade,
          img_tue_aft_t3: imgUrl,
          sub_tue_aft_t3: subs,
          tname_tue_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t3: grade,
          img_tue_aft_t3: imgUrl,
          sub_tue_aft_t3: subs,
          tname_tue_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t3: grade,
            img_tue_aft_t3: imgUrl,
            sub_tue_aft_t3: subs,
            tname_tue_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell16') {
      if (data_row_16.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          t_grade_tue_aft_t4: getT_grade,
          teacher_type_tue_aft_t4: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_tue_aft_t4: grade,
            img_tue_aft_t4: imgUrl,
            sub_tue_aft_t4: subs,
            tname_tue_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_tue_aft_t4: grade,
            img_tue_aft_t4: imgUrl,
            sub_tue_aft_t4: subs,
            tname_tue_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t4: grade,
            img_tue_aft_t4: imgUrl,
            sub_tue_aft_t4: subs,
            tname_tue_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell17') {
      if (data_row_17.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          t_grade_wed_mor_t1: getT_grade,
          teacher_type_wed_mor_t1: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_mor_t1: grade,
            img_wed_mor_t1: imgUrl,
            sub_wed_mor_t1: subs,
            tname_wed_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_mor_t1: grade,
            img_wed_mor_t1: imgUrl,
            sub_wed_mor_t1: subs,
            tname_wed_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t1: grade,
            img_wed_mor_t1: imgUrl,
            sub_wed_mor_t1: subs,
            tname_wed_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell18') {
      if (data_row_18.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          t_grade_wed_mor_t2: getT_grade,
          teacher_type_wed_mor_t2: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_mor_t2: grade,
            img_wed_mor_t2: imgUrl,
            sub_wed_mor_t2: subs,
            tname_wed_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_mor_t2: grade,
            img_wed_mor_t2: imgUrl,
            sub_wed_mor_t2: subs,
            tname_wed_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t2: grade,
            img_wed_mor_t2: imgUrl,
            sub_wed_mor_t2: subs,
            tname_wed_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell19') {
      if (data_row_19.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          t_grade_wed_mor_t3: getT_grade,
          teacher_type_wed_mor_t3: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_mor_t3: grade,
            img_wed_mor_t3: imgUrl,
            sub_wed_mor_t3: subs,
            tname_wed_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_mor_t3: grade,
            img_wed_mor_t3: imgUrl,
            sub_wed_mor_t3: subs,
            tname_wed_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t3: grade,
            img_wed_mor_t3: imgUrl,
            sub_wed_mor_t3: subs,
            tname_wed_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell20') {
      if (data_row_20.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          t_grade_wed_mor_t4: getT_grade,
          teacher_type_wed_mor_t4: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_mor_t4: grade,
            img_wed_mor_t4: imgUrl,
            sub_wed_mor_t4: subs,
            tname_wed_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_mor_t4: grade,
            img_wed_mor_t4: imgUrl,
            sub_wed_mor_t4: subs,
            tname_wed_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t4: grade,
            img_wed_mor_t4: imgUrl,
            sub_wed_mor_t4: subs,
            tname_wed_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell21') {
      if (data_row_21.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          t_grade_wed_aft_t1: getT_grade,
          teacher_type_wed_aft_t1: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_aft_t1: grade,
            img_wed_aft_t1: imgUrl,
            sub_wed_aft_t1: subs,
            tname_wed_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_aft_t1: grade,
            img_wed_aft_t1: imgUrl,
            sub_wed_aft_t1: subs,
            tname_wed_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t1: grade,
            img_wed_aft_t1: imgUrl,
            sub_wed_aft_t1: subs,
            tname_wed_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell22') {
      if (data_row_22.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          t_grade_wed_aft_t2: getT_grade,
          teacher_type_wed_aft_t2: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_aft_t2: grade,
            img_wed_aft_t2: imgUrl,
            sub_wed_aft_t2: subs,
            tname_wed_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_aft_t2: grade,
            img_wed_aft_t2: imgUrl,
            sub_wed_aft_t2: subs,
            tname_wed_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t2: grade,
            img_wed_aft_t2: imgUrl,
            sub_wed_aft_t2: subs,
            tname_wed_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell23') {
      if (data_row_23.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          t_grade_wed_aft_t3: getT_grade,
          teacher_type_wed_aft_t3: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_aft_t3: grade,
            img_wed_aft_t3: imgUrl,
            sub_wed_aft_t3: subs,
            tname_wed_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_aft_t3: grade,
            img_wed_aft_t3: imgUrl,
            sub_wed_aft_t3: subs,
            tname_wed_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t3: grade,
            img_wed_aft_t3: imgUrl,
            sub_wed_aft_t3: subs,
            tname_wed_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell24') {
      if (data_row_24.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          t_grade_wed_aft_t4: getT_grade,
          teacher_type_wed_aft_t4: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_wed_aft_t4: grade,
            img_wed_aft_t4: imgUrl,
            sub_wed_aft_t4: subs,
            tname_wed_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_wed_aft_t4: grade,
            img_wed_aft_t4: imgUrl,
            sub_wed_aft_t4: subs,
            tname_wed_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t4: grade,
            img_wed_aft_t4: imgUrl,
            sub_wed_aft_t4: subs,
            tname_wed_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell25') {
      if (data_row_25.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          t_grade_thu_mor_t1: getT_grade,
          teacher_type_thu_mor_t1: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_mor_t1: grade,
            img_thu_mor_t1: imgUrl,
            sub_thu_mor_t1: subs,
            tname_thu_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_mor_t1: grade,
            img_thu_mor_t1: imgUrl,
            sub_thu_mor_t1: subs,
            tname_thu_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t1: grade,
            img_thu_mor_t1: imgUrl,
            sub_thu_mor_t1: subs,
            tname_thu_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell26') {
      if (data_row_26.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          t_grade_thu_mor_t2: getT_grade,
          teacher_type_thu_mor_t2: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_mor_t2: grade,
            img_thu_mor_t2: imgUrl,
            sub_thu_mor_t2: subs,
            tname_thu_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_mor_t2: grade,
            img_thu_mor_t2: imgUrl,
            sub_thu_mor_t2: subs,
            tname_thu_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t2: grade,
            img_thu_mor_t2: imgUrl,
            sub_thu_mor_t2: subs,
            tname_thu_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell27') {
      if (data_row_27.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          t_grade_thu_mor_t3: getT_grade,
          teacher_type_thu_mor_t3: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_mor_t3: grade,
            img_thu_mor_t3: imgUrl,
            sub_thu_mor_t3: subs,
            tname_thu_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_mor_t3: grade,
            img_thu_mor_t3: imgUrl,
            sub_thu_mor_t3: subs,
            tname_thu_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'PE') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t3: grade,
            img_thu_mor_t3: imgUrl,
            sub_thu_mor_t3: subs,
            tname_thu_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell28') {
      if (data_row_28.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          t_grade_thu_mor_t4: getT_grade,
          teacher_type_thu_mor_t4: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_mor_t4: grade,
            img_thu_mor_t4: imgUrl,
            sub_thu_mor_t4: subs,
            tname_thu_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_mor_t4: grade,
            img_thu_mor_t4: imgUrl,
            sub_thu_mor_t4: subs,
            tname_thu_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t4: grade,
            img_thu_mor_t4: imgUrl,
            sub_thu_mor_t4: subs,
            tname_thu_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell29') {
      if (data_row_29.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          t_grade_thu_aft_t1: getT_grade,
          teacher_type_thu_aft_t1: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_aft_t1: grade,
            img_thu_aft_t1: imgUrl,
            sub_thu_aft_t1: subs,
            tname_thu_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_aft_t1: grade,
            img_thu_aft_t1: imgUrl,
            sub_thu_aft_t1: subs,
            tname_thu_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t1: grade,
            img_thu_aft_t1: imgUrl,
            sub_thu_aft_t1: subs,
            tname_thu_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell30') {
      if (data_row_30.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          t_grade_thu_aft_t2: getT_grade,
          teacher_type_thu_aft_t2: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_aft_t2: grade,
            img_thu_aft_t2: imgUrl,
            sub_thu_aft_t2: subs,
            tname_thu_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_aft_t2: grade,
            img_thu_aft_t2: imgUrl,
            sub_thu_aft_t2: subs,
            tname_thu_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t2: grade,
            img_thu_aft_t2: imgUrl,
            sub_thu_aft_t2: subs,
            tname_thu_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell31') {
      if (data_row_31.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          t_grade_thu_aft_t3: getT_grade,
          teacher_type_thu_aft_t3: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_aft_t3: grade,
            img_thu_aft_t3: imgUrl,
            sub_thu_aft_t3: subs,
            tname_thu_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_aft_t3: grade,
            img_thu_aft_t3: imgUrl,
            sub_thu_aft_t3: subs,
            tname_thu_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t3: grade,
            img_thu_aft_t3: imgUrl,
            sub_thu_aft_t3: subs,
            tname_thu_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell32') {
      if (data_row_32.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          t_grade_thu_aft_t4: getT_grade,
          teacher_type_thu_aft_t4: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_thu_aft_t4: grade,
            img_thu_aft_t4: imgUrl,
            sub_thu_aft_t4: subs,
            tname_thu_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_thu_aft_t4: grade,
            img_thu_aft_t4: imgUrl,
            sub_thu_aft_t4: subs,
            tname_thu_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,

        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t4: grade,
            img_thu_aft_t4: imgUrl,
            sub_thu_aft_t4: subs,
            tname_thu_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,

          });
        }
      }
    }
    else if (data_cell === 'cell33') {
      if (data_row_33.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          t_grade_fri_mor_t1: getT_grade,
          teacher_type_fri_mor_t1: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_mor_t1: grade,
            img_fri_mor_t1: imgUrl,
            sub_fri_mor_t1: subs,
            tname_fri_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_mor_t1: grade,
            img_fri_mor_t1: imgUrl,
            sub_fri_mor_t1: subs,
            tname_fri_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t1: grade,
            img_fri_mor_t1: imgUrl,
            sub_fri_mor_t1: subs,
            tname_fri_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell34') {
      if (data_row_34.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          t_grade_fri_mor_t2: getT_grade,
          teacher_type_fri_mor_t2: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_mor_t2: grade,
            img_fri_mor_t2: imgUrl,
            sub_fri_mor_t2: subs,
            tname_fri_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_mor_t2: grade,
            img_fri_mor_t2: imgUrl,
            sub_fri_mor_t2: subs,
            tname_fri_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t2: grade,
            img_fri_mor_t2: imgUrl,
            sub_fri_mor_t2: subs,
            tname_fri_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell35') {
      if (data_row_35.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          t_grade_fri_mor_t3: getT_grade,
          teacher_type_fri_mor_t3: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_mor_t3: grade,
            img_fri_mor_t3: imgUrl,
            sub_fri_mor_t3: subs,
            tname_fri_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_mor_t3: grade,
            img_fri_mor_t3: imgUrl,
            sub_fri_mor_t3: subs,
            tname_fri_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t3: grade,
            img_fri_mor_t3: imgUrl,
            sub_fri_mor_t3: subs,
            tname_fri_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell36') {
      if (data_row_36.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          t_grade_fri_mor_t4: getT_grade,
          teacher_type_fri_mor_t4: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_mor_t4: grade,
            img_fri_mor_t4: imgUrl,
            sub_fri_mor_t4: subs,
            tname_fri_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_mor_t4: grade,
            img_fri_mor_t4: imgUrl,
            sub_fri_mor_t4: subs,
            tname_fri_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t4: grade,
            img_fri_mor_t4: imgUrl,
            sub_fri_mor_t4: subs,
            tname_fri_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell37') {
      if (data_row_37.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          t_grade_fri_aft_t1: getT_grade,
          teacher_type_fri_aft_t1: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_aft_t1: grade,
            img_fri_aft_t1: imgUrl,
            sub_fri_aft_t1: subs,
            tname_fri_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_aft_t1: grade,
            img_fri_aft_t1: imgUrl,
            sub_fri_aft_t1: subs,
            tname_fri_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t1: grade,
            img_fri_aft_t1: imgUrl,
            sub_fri_aft_t1: subs,
            tname_fri_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell38') {
      if (data_row_38.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          t_grade_fri_aft_t2: getT_grade,
          teacher_type_fri_aft_t2: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_aft_t2: grade,
            img_fri_aft_t2: imgUrl,
            sub_fri_aft_t2: subs,
            tname_fri_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_aft_t2: grade,
            img_fri_aft_t2: imgUrl,
            sub_fri_aft_t2: subs,
            tname_fri_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t2: grade,
            img_fri_aft_t2: imgUrl,
            sub_fri_aft_t2: subs,
            tname_fri_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell39') {
      if (data_row_39.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          t_grade_fri_aft_t3: getT_grade,
          teacher_type_fri_aft_t3: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_aft_t3: grade,
            img_fri_aft_t3: imgUrl,
            sub_fri_aft_t3: subs,
            tname_fri_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_aft_t3: grade,
            img_fri_aft_t3: imgUrl,
            sub_fri_aft_t3: subs,
            tname_fri_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t3: grade,
            img_fri_aft_t3: imgUrl,
            sub_fri_aft_t3: subs,
            tname_fri_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell40') {
      if (data_row_40.includes(id)) {
        Swal.fire({
          text: "ឈ្មោះគ្រូដូចគ្នា មិនអាចបញ្ចូលបាននោះទេ!",
          icon: "error",
          showConfirmButton: false,
          timer: 1600,
        });

      } else {
        Swal.fire({
          text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
          icon: "success",
          showConfirmButton: false,
          timer: 2200,
        });
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          t_grade_fri_aft_t4: getT_grade,
          teacher_type_fri_aft_t4: getteacher_type,
          nickname: user_nick,
          permission: userType,
        });

        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
        if (userType === 'no') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
            grade_fri_aft_t4: grade,
            img_fri_aft_t4: imgUrl,
            sub_fri_aft_t4: subs,
            tname_fri_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
        if (userType === 'ok') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
            grade_fri_aft_t4: grade,
            img_fri_aft_t4: imgUrl,
            sub_fri_aft_t4: subs,
            tname_fri_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }

      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'PE') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t4: grade,
            img_fri_aft_t4: imgUrl,
            sub_fri_aft_t4: subs,
            tname_fri_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else {
      Swal.fire({
        text: "ព័ត៍មានបញ្ចូលមិនត្រឹមត្រូវ!",
        icon: "error",
        showConfirmButton: false,
        timer: 1600,
      });
    }
  }

  const updateTimeTable = (e) => {
    const db = getDatabase();
    const id = user_id.current.value
    const imgUrl = user_img.current.value
    const nickname = user_nick
    const subs = set_user_sub.current.value
    const grade = user_g
    if (data_cell === 'cell1') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t1: grade,
        img_mon_mor_t1: imgUrl,
        sub_mon_mor_t1: subs,
        tname_mon_mor_t1: id,
        t_grade_mon_mor_t1: getT_grade,
        teacher_type_mon_mor_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t1: grade,
        img_mon_mor_t1: imgUrl,
        sub_mon_mor_t1: subs,
        tname_mon_mor_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t1: grade,
          img_mon_mor_t1: imgUrl,
          sub_mon_mor_t1: subs,
          tname_mon_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t1: grade,
            img_mon_mor_t1: imgUrl,
            sub_mon_mor_t1: subs,
            tname_mon_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell2') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t2: grade,
        img_mon_mor_t2: imgUrl,
        sub_mon_mor_t2: subs,
        tname_mon_mor_t2: id,
        t_grade_mon_mor_t2: getT_grade,
        teacher_type_mon_mor_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t2: grade,
        img_mon_mor_t2: imgUrl,
        sub_mon_mor_t2: subs,
        tname_mon_mor_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t2: grade,
          img_mon_mor_t2: imgUrl,
          sub_mon_mor_t2: subs,
          tname_mon_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t2: grade,
            img_mon_mor_t2: imgUrl,
            sub_mon_mor_t2: subs,
            tname_mon_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell3') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t3: grade,
        img_mon_mor_t3: imgUrl,
        sub_mon_mor_t3: subs,
        tname_mon_mor_t3: id,
        t_grade_mon_mor_t3: getT_grade,
        teacher_type_mon_mor_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t3: grade,
        img_mon_mor_t3: imgUrl,
        sub_mon_mor_t3: subs,
        tname_mon_mor_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t3: grade,
          img_mon_mor_t3: imgUrl,
          sub_mon_mor_t3: subs,
          tname_mon_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t3: grade,
            img_mon_mor_t3: imgUrl,
            sub_mon_mor_t3: subs,
            tname_mon_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell4') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t4: grade,
        img_mon_mor_t4: imgUrl,
        sub_mon_mor_t4: subs,
        tname_mon_mor_t4: id,
        t_grade_mon_mor_t4: getT_grade,
        teacher_type_mon_mor_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t4: grade,
        img_mon_mor_t4: imgUrl,
        sub_mon_mor_t4: subs,
        tname_mon_mor_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t4: grade,
          img_mon_mor_t4: imgUrl,
          sub_mon_mor_t4: subs,
          tname_mon_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t4: grade,
            img_mon_mor_t4: imgUrl,
            sub_mon_mor_t4: subs,
            tname_mon_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell5') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t1: grade,
        img_mon_aft_t1: imgUrl,
        sub_mon_aft_t1: subs,
        tname_mon_aft_t1: id,
        t_grade_mon_aft_t1: getT_grade,
        teacher_type_mon_aft_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t1: grade,
        img_mon_aft_t1: imgUrl,
        sub_mon_aft_t1: subs,
        tname_mon_aft_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t1: grade,
          img_mon_aft_t1: imgUrl,
          sub_mon_aft_t1: subs,
          tname_mon_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t1: grade,
            img_mon_aft_t1: imgUrl,
            sub_mon_aft_t1: subs,
            tname_mon_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell6') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t2: grade,
        img_mon_aft_t2: imgUrl,
        sub_mon_aft_t2: subs,
        tname_mon_aft_t2: id,
        t_grade_mon_aft_t2: getT_grade,
        teacher_type_mon_aft_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t2: grade,
        img_mon_aft_t2: imgUrl,
        sub_mon_aft_t2: subs,
        tname_mon_aft_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t2: grade,
          img_mon_aft_t2: imgUrl,
          sub_mon_aft_t2: subs,
          tname_mon_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t2: grade,
            img_mon_aft_t2: imgUrl,
            sub_mon_aft_t2: subs,
            tname_mon_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell7') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t3: grade,
        img_mon_aft_t3: imgUrl,
        sub_mon_aft_t3: subs,
        tname_mon_aft_t3: id,
        t_grade_mon_aft_t3: getT_grade,
        teacher_type_mon_aft_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t3: grade,
        img_mon_aft_t3: imgUrl,
        sub_mon_aft_t3: subs,
        tname_mon_aft_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t3: grade,
          img_mon_aft_t3: imgUrl,
          sub_mon_aft_t3: subs,
          tname_mon_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t3: grade,
            img_mon_aft_t3: imgUrl,
            sub_mon_aft_t3: subs,
            tname_mon_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell8') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t4: grade,
        img_mon_aft_t4: imgUrl,
        sub_mon_aft_t4: subs,
        tname_mon_aft_t4: id,
        t_grade_mon_aft_t4: getT_grade,
        teacher_type_mon_aft_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t4: grade,
        img_mon_aft_t4: imgUrl,
        sub_mon_aft_t4: subs,
        tname_mon_aft_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,

      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t4: grade,
          img_mon_aft_t4: imgUrl,
          sub_mon_aft_t4: subs,
          tname_mon_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t4: grade,
            img_mon_aft_t4: imgUrl,
            sub_mon_aft_t4: subs,
            tname_mon_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell9') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t1: grade,
        img_tue_mor_t1: imgUrl,
        sub_tue_mor_t1: subs,
        tname_tue_mor_t1: id,
        t_grade_tue_mor_t1: getT_grade,
        teacher_type_tue_mor_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t1: grade,
        img_tue_mor_t1: imgUrl,
        sub_tue_mor_t1: subs,
        tname_tue_mor_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t1: grade,
          img_tue_mor_t1: imgUrl,
          sub_tue_mor_t1: subs,
          tname_tue_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t1: grade,
            img_tue_mor_t1: imgUrl,
            sub_tue_mor_t1: subs,
            tname_tue_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell10') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t2: grade,
        img_tue_mor_t2: imgUrl,
        sub_tue_mor_t2: subs,
        tname_tue_mor_t2: id,
        t_grade_tue_mor_t2: getT_grade,
        teacher_type_tue_mor_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t2: grade,
        img_tue_mor_t2: imgUrl,
        sub_tue_mor_t2: subs,
        tname_tue_mor_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t2: grade,
          img_tue_mor_t2: imgUrl,
          sub_tue_mor_t2: subs,
          tname_tue_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t2: grade,
            img_tue_mor_t2: imgUrl,
            sub_tue_mor_t2: subs,
            tname_tue_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell11') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t3: grade,
        img_tue_mor_t3: imgUrl,
        sub_tue_mor_t3: subs,
        tname_tue_mor_t3: id,
        t_grade_tue_mor_t3: getT_grade,
        teacher_type_tue_mor_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t3: grade,
        img_tue_mor_t3: imgUrl,
        sub_tue_mor_t3: subs,
        tname_tue_mor_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t3: grade,
          img_tue_mor_t3: imgUrl,
          sub_tue_mor_t3: subs,
          tname_tue_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t3: grade,
            img_tue_mor_t3: imgUrl,
            sub_tue_mor_t3: subs,
            tname_tue_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell12') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t4: grade,
        img_tue_mor_t4: imgUrl,
        sub_tue_mor_t4: subs,
        tname_tue_mor_t4: id,
        t_grade_tue_mor_t4: getT_grade,
        teacher_type_tue_mor_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t4: grade,
        img_tue_mor_t4: imgUrl,
        sub_tue_mor_t4: subs,
        tname_tue_mor_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t4: grade,
          img_tue_mor_t4: imgUrl,
          sub_tue_mor_t4: subs,
          tname_tue_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t4: grade,
            img_tue_mor_t4: imgUrl,
            sub_tue_mor_t4: subs,
            tname_tue_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell13') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t1: grade,
        img_tue_aft_t1: imgUrl,
        sub_tue_aft_t1: subs,
        tname_tue_aft_t1: id,
        t_grade_tue_aft_t1: getT_grade,
        teacher_type_tue_aft_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t1: grade,
        img_tue_aft_t1: imgUrl,
        sub_tue_aft_t1: subs,
        tname_tue_aft_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t1: grade,
          img_tue_aft_t1: imgUrl,
          sub_tue_aft_t1: subs,
          tname_tue_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t1: grade,
            img_tue_aft_t1: imgUrl,
            sub_tue_aft_t1: subs,
            tname_tue_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell14') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t2: grade,
        img_tue_aft_t2: imgUrl,
        sub_tue_aft_t2: subs,
        tname_tue_aft_t2: id,
        t_grade_tue_aft_t2: getT_grade,
        teacher_type_tue_aft_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t2: grade,
        img_tue_aft_t2: imgUrl,
        sub_tue_aft_t2: subs,
        tname_tue_aft_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t2: grade,
          img_tue_aft_t2: imgUrl,
          sub_tue_aft_t2: subs,
          tname_tue_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t2: grade,
            img_tue_aft_t2: imgUrl,
            sub_tue_aft_t2: subs,
            tname_tue_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell15') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t3: grade,
        img_tue_aft_t3: imgUrl,
        sub_tue_aft_t3: subs,
        tname_tue_aft_t3: id,
        t_grade_tue_aft_t3: getT_grade,
        teacher_type_tue_aft_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t3: grade,
        img_tue_aft_t3: imgUrl,
        sub_tue_aft_t3: subs,
        tname_tue_aft_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t3: grade,
          img_tue_aft_t3: imgUrl,
          sub_tue_aft_t3: subs,
          tname_tue_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t3: grade,
          img_tue_aft_t3: imgUrl,
          sub_tue_aft_t3: subs,
          tname_tue_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t3: grade,
          img_tue_aft_t3: imgUrl,
          sub_tue_aft_t3: subs,
          tname_tue_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t3: grade,
            img_tue_aft_t3: imgUrl,
            sub_tue_aft_t3: subs,
            tname_tue_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell16') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t4: grade,
        img_tue_aft_t4: imgUrl,
        sub_tue_aft_t4: subs,
        tname_tue_aft_t4: id,
        t_grade_tue_aft_t4: getT_grade,
        teacher_type_tue_aft_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t4: grade,
        img_tue_aft_t4: imgUrl,
        sub_tue_aft_t4: subs,
        tname_tue_aft_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t4: grade,
          img_tue_aft_t4: imgUrl,
          sub_tue_aft_t4: subs,
          tname_tue_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t4: grade,
            img_tue_aft_t4: imgUrl,
            sub_tue_aft_t4: subs,
            tname_tue_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell17') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t1: grade,
        img_wed_mor_t1: imgUrl,
        sub_wed_mor_t1: subs,
        tname_wed_mor_t1: id,
        t_grade_wed_mor_t1: getT_grade,
        teacher_type_wed_mor_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t1: grade,
        img_wed_mor_t1: imgUrl,
        sub_wed_mor_t1: subs,
        tname_wed_mor_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t1: grade,
          img_wed_mor_t1: imgUrl,
          sub_wed_mor_t1: subs,
          tname_wed_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t1: grade,
            img_wed_mor_t1: imgUrl,
            sub_wed_mor_t1: subs,
            tname_wed_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell18') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t2: grade,
        img_wed_mor_t2: imgUrl,
        sub_wed_mor_t2: subs,
        tname_wed_mor_t2: id,
        t_grade_wed_mor_t2: getT_grade,
        teacher_type_wed_mor_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t2: grade,
        img_wed_mor_t2: imgUrl,
        sub_wed_mor_t2: subs,
        tname_wed_mor_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t2: grade,
          img_wed_mor_t2: imgUrl,
          sub_wed_mor_t2: subs,
          tname_wed_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t2: grade,
            img_wed_mor_t2: imgUrl,
            sub_wed_mor_t2: subs,
            tname_wed_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell19') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t3: grade,
        img_wed_mor_t3: imgUrl,
        sub_wed_mor_t3: subs,
        tname_wed_mor_t3: id,
        t_grade_wed_mor_t3: getT_grade,
        teacher_type_wed_mor_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t3: grade,
        img_wed_mor_t3: imgUrl,
        sub_wed_mor_t3: subs,
        tname_wed_mor_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t3: grade,
          img_wed_mor_t3: imgUrl,
          sub_wed_mor_t3: subs,
          tname_wed_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t3: grade,
            img_wed_mor_t3: imgUrl,
            sub_wed_mor_t3: subs,
            tname_wed_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell20') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t4: grade,
        img_wed_mor_t4: imgUrl,
        sub_wed_mor_t4: subs,
        tname_wed_mor_t4: id,
        t_grade_wed_mor_t4: getT_grade,
        teacher_type_wed_mor_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t4: grade,
        img_wed_mor_t4: imgUrl,
        sub_wed_mor_t4: subs,
        tname_wed_mor_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t4: grade,
          img_wed_mor_t4: imgUrl,
          sub_wed_mor_t4: subs,
          tname_wed_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t4: grade,
            img_wed_mor_t4: imgUrl,
            sub_wed_mor_t4: subs,
            tname_wed_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell21') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t1: grade,
        img_wed_aft_t1: imgUrl,
        sub_wed_aft_t1: subs,
        tname_wed_aft_t1: id,
        t_grade_wed_aft_t1: getT_grade,
        teacher_type_wed_aft_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t1: grade,
        img_wed_aft_t1: imgUrl,
        sub_wed_aft_t1: subs,
        tname_wed_aft_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t1: grade,
          img_wed_aft_t1: imgUrl,
          sub_wed_aft_t1: subs,
          tname_wed_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t1: grade,
            img_wed_aft_t1: imgUrl,
            sub_wed_aft_t1: subs,
            tname_wed_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell22') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t2: grade,
        img_wed_aft_t2: imgUrl,
        sub_wed_aft_t2: subs,
        tname_wed_aft_t2: id,
        t_grade_wed_aft_t2: getT_grade,
        teacher_type_wed_aft_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t2: grade,
        img_wed_aft_t2: imgUrl,
        sub_wed_aft_t2: subs,
        tname_wed_aft_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t2: grade,
          img_wed_aft_t2: imgUrl,
          sub_wed_aft_t2: subs,
          tname_wed_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t2: grade,
            img_wed_aft_t2: imgUrl,
            sub_wed_aft_t2: subs,
            tname_wed_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell23') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t3: grade,
        img_wed_aft_t3: imgUrl,
        sub_wed_aft_t3: subs,
        tname_wed_aft_t3: id,
        t_grade_wed_aft_t3: getT_grade,
        teacher_type_wed_aft_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t3: grade,
        img_wed_aft_t3: imgUrl,
        sub_wed_aft_t3: subs,
        tname_wed_aft_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t3: grade,
          img_wed_aft_t3: imgUrl,
          sub_wed_aft_t3: subs,
          tname_wed_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t3: grade,
            img_wed_aft_t3: imgUrl,
            sub_wed_aft_t3: subs,
            tname_wed_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell24') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t4: grade,
        img_wed_aft_t4: imgUrl,
        sub_wed_aft_t4: subs,
        tname_wed_aft_t4: id,
        t_grade_wed_aft_t4: getT_grade,
        teacher_type_wed_aft_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t4: grade,
        img_wed_aft_t4: imgUrl,
        sub_wed_aft_t4: subs,
        tname_wed_aft_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t4: grade,
          img_wed_aft_t4: imgUrl,
          sub_wed_aft_t4: subs,
          tname_wed_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t4: grade,
            img_wed_aft_t4: imgUrl,
            sub_wed_aft_t4: subs,
            tname_wed_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell25') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t1: grade,
        img_thu_mor_t1: imgUrl,
        sub_thu_mor_t1: subs,
        tname_thu_mor_t1: id,
        t_grade_thu_mor_t1: getT_grade,
        teacher_type_thu_mor_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t1: grade,
        img_thu_mor_t1: imgUrl,
        sub_thu_mor_t1: subs,
        tname_thu_mor_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t1: grade,
          img_thu_mor_t1: imgUrl,
          sub_thu_mor_t1: subs,
          tname_thu_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t1: grade,
            img_thu_mor_t1: imgUrl,
            sub_thu_mor_t1: subs,
            tname_thu_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell26') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t2: grade,
        img_thu_mor_t2: imgUrl,
        sub_thu_mor_t2: subs,
        tname_thu_mor_t2: id,
        t_grade_thu_mor_t2: getT_grade,
        teacher_type_thu_mor_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t2: grade,
        img_thu_mor_t2: imgUrl,
        sub_thu_mor_t2: subs,
        tname_thu_mor_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t2: grade,
          img_thu_mor_t2: imgUrl,
          sub_thu_mor_t2: subs,
          tname_thu_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t2: grade,
            img_thu_mor_t2: imgUrl,
            sub_thu_mor_t2: subs,
            tname_thu_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell27') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t3: grade,
        img_thu_mor_t3: imgUrl,
        sub_thu_mor_t3: subs,
        tname_thu_mor_t3: id,
        t_grade_thu_mor_t3: getT_grade,
        teacher_type_thu_mor_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t3: grade,
        img_thu_mor_t3: imgUrl,
        sub_thu_mor_t3: subs,
        tname_thu_mor_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t3: grade,
          img_thu_mor_t3: imgUrl,
          sub_thu_mor_t3: subs,
          tname_thu_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t3: grade,
            img_thu_mor_t3: imgUrl,
            sub_thu_mor_t3: subs,
            tname_thu_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell28') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t4: grade,
        img_thu_mor_t4: imgUrl,
        sub_thu_mor_t4: subs,
        tname_thu_mor_t4: id,
        t_grade_thu_mor_t4: getT_grade,
        teacher_type_thu_mor_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t4: grade,
        img_thu_mor_t4: imgUrl,
        sub_thu_mor_t4: subs,
        tname_thu_mor_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t4: grade,
          img_thu_mor_t4: imgUrl,
          sub_thu_mor_t4: subs,
          tname_thu_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t4: grade,
            img_thu_mor_t4: imgUrl,
            sub_thu_mor_t4: subs,
            tname_thu_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell29') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t1: grade,
        img_thu_aft_t1: imgUrl,
        sub_thu_aft_t1: subs,
        tname_thu_aft_t1: id,
        t_grade_thu_aft_t1: getT_grade,
        teacher_type_thu_aft_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t1: grade,
        img_thu_aft_t1: imgUrl,
        sub_thu_aft_t1: subs,
        tname_thu_aft_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t1: grade,
          img_thu_aft_t1: imgUrl,
          sub_thu_aft_t1: subs,
          tname_thu_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t1: grade,
            img_thu_aft_t1: imgUrl,
            sub_thu_aft_t1: subs,
            tname_thu_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell30') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t2: grade,
        img_thu_aft_t2: imgUrl,
        sub_thu_aft_t2: subs,
        tname_thu_aft_t2: id,
        t_grade_thu_aft_t2: getT_grade,
        teacher_type_thu_aft_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t2: grade,
        img_thu_aft_t2: imgUrl,
        sub_thu_aft_t2: subs,
        tname_thu_aft_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t2: grade,
          img_thu_aft_t2: imgUrl,
          sub_thu_aft_t2: subs,
          tname_thu_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t2: grade,
            img_thu_aft_t2: imgUrl,
            sub_thu_aft_t2: subs,
            tname_thu_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell31') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t3: grade,
        img_thu_aft_t3: imgUrl,
        sub_thu_aft_t3: subs,
        tname_thu_aft_t3: id,
        t_grade_thu_aft_t3: getT_grade,
        teacher_type_thu_aft_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t3: grade,
        img_thu_aft_t3: imgUrl,
        sub_thu_aft_t3: subs,
        tname_thu_aft_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t3: grade,
          img_thu_aft_t3: imgUrl,
          sub_thu_aft_t3: subs,
          tname_thu_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t3: grade,
            img_thu_aft_t3: imgUrl,
            sub_thu_aft_t3: subs,
            tname_thu_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell32') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t4: grade,
        img_thu_aft_t4: imgUrl,
        sub_thu_aft_t4: subs,
        tname_thu_aft_t4: id,
        t_grade_thu_aft_t4: getT_grade,
        teacher_type_thu_aft_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t4: grade,
        img_thu_aft_t4: imgUrl,
        sub_thu_aft_t4: subs,
        tname_thu_aft_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t4: grade,
          img_thu_aft_t4: imgUrl,
          sub_thu_aft_t4: subs,
          tname_thu_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t4: grade,
            img_thu_aft_t4: imgUrl,
            sub_thu_aft_t4: subs,
            tname_thu_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell33') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t1: grade,
        img_fri_mor_t1: imgUrl,
        sub_fri_mor_t1: subs,
        tname_fri_mor_t1: id,
        t_grade_fri_mor_t1: getT_grade,
        teacher_type_fri_mor_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t1: grade,
        img_fri_mor_t1: imgUrl,
        sub_fri_mor_t1: subs,
        tname_fri_mor_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t1: grade,
          img_fri_mor_t1: imgUrl,
          sub_fri_mor_t1: subs,
          tname_fri_mor_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t1: grade,
            img_fri_mor_t1: imgUrl,
            sub_fri_mor_t1: subs,
            tname_fri_mor_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell34') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t2: grade,
        img_fri_mor_t2: imgUrl,
        sub_fri_mor_t2: subs,
        tname_fri_mor_t2: id,
        t_grade_fri_mor_t2: getT_grade,
        teacher_type_fri_mor_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t2: grade,
        img_fri_mor_t2: imgUrl,
        sub_fri_mor_t2: subs,
        tname_fri_mor_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t2: grade,
          img_fri_mor_t2: imgUrl,
          sub_fri_mor_t2: subs,
          tname_fri_mor_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t2: grade,
            img_fri_mor_t2: imgUrl,
            sub_fri_mor_t2: subs,
            tname_fri_mor_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell35') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t3: grade,
        img_fri_mor_t3: imgUrl,
        sub_fri_mor_t3: subs,
        tname_fri_mor_t3: id,
        t_grade_fri_mor_t3: getT_grade,
        teacher_type_fri_mor_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t3: grade,
        img_fri_mor_t3: imgUrl,
        sub_fri_mor_t3: subs,
        tname_fri_mor_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t3: grade,
          img_fri_mor_t3: imgUrl,
          sub_fri_mor_t3: subs,
          tname_fri_mor_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t3: grade,
            img_fri_mor_t3: imgUrl,
            sub_fri_mor_t3: subs,
            tname_fri_mor_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell36') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t4: grade,
        img_fri_mor_t4: imgUrl,
        sub_fri_mor_t4: subs,
        tname_fri_mor_t4: id,
        t_grade_fri_mor_t4: getT_grade,
        teacher_type_fri_mor_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t4: grade,
        img_fri_mor_t4: imgUrl,
        sub_fri_mor_t4: subs,
        tname_fri_mor_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t4: grade,
          img_fri_mor_t4: imgUrl,
          sub_fri_mor_t4: subs,
          tname_fri_mor_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t4: grade,
            img_fri_mor_t4: imgUrl,
            sub_fri_mor_t4: subs,
            tname_fri_mor_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell37') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t1: grade,
        img_fri_aft_t1: imgUrl,
        sub_fri_aft_t1: subs,
        tname_fri_aft_t1: id,
        t_grade_fri_aft_t1: getT_grade,
        teacher_type_fri_aft_t1: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t1: grade,
        img_fri_aft_t1: imgUrl,
        sub_fri_aft_t1: subs,
        tname_fri_aft_t1: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t1: grade,
          img_fri_aft_t1: imgUrl,
          sub_fri_aft_t1: subs,
          tname_fri_aft_t1: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t1: grade,
            img_fri_aft_t1: imgUrl,
            sub_fri_aft_t1: subs,
            tname_fri_aft_t1: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell38') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t2: grade,
        img_fri_aft_t2: imgUrl,
        sub_fri_aft_t2: subs,
        tname_fri_aft_t2: id,
        t_grade_fri_aft_t2: getT_grade,
        teacher_type_fri_aft_t2: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t2: grade,
        img_fri_aft_t2: imgUrl,
        sub_fri_aft_t2: subs,
        tname_fri_aft_t2: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t2: grade,
          img_fri_aft_t2: imgUrl,
          sub_fri_aft_t2: subs,
          tname_fri_aft_t2: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t2: grade,
            img_fri_aft_t2: imgUrl,
            sub_fri_aft_t2: subs,
            tname_fri_aft_t2: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell39') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t3: grade,
        img_fri_aft_t3: imgUrl,
        sub_fri_aft_t3: subs,
        tname_fri_aft_t3: id,
        t_grade_fri_aft_t3: getT_grade,
        teacher_type_fri_aft_t3: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t3: grade,
        img_fri_aft_t3: imgUrl,
        sub_fri_aft_t3: subs,
        tname_fri_aft_t3: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t3: grade,
          img_fri_aft_t3: imgUrl,
          sub_fri_aft_t3: subs,
          tname_fri_aft_t3: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t3: grade,
            img_fri_aft_t3: imgUrl,
            sub_fri_aft_t3: subs,
            tname_fri_aft_t3: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else if (data_cell === 'cell40') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t4: grade,
        img_fri_aft_t4: imgUrl,
        sub_fri_aft_t4: subs,
        tname_fri_aft_t4: id,
        t_grade_fri_aft_t4: getT_grade,
        teacher_type_fri_aft_t4: getteacher_type,
        nickname: user_nick,
        permission: userType,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t4: grade,
        img_fri_aft_t4: imgUrl,
        sub_fri_aft_t4: subs,
        tname_fri_aft_t4: id,
        nickname: user_nick,
        permission: userType,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type,
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t4: grade,
          img_fri_aft_t4: imgUrl,
          sub_fri_aft_t4: subs,
          tname_fri_aft_t4: id,
          nickname: user_nick,
          permission: userType,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type,
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t4: grade,
            img_fri_aft_t4: imgUrl,
            sub_fri_aft_t4: subs,
            tname_fri_aft_t4: id,
            nickname: user_nick,
            permission: userType,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type,
          });
        }
      }
    }
    else {
      Swal.fire({
        text: "ព័ត៍មានកែមិនត្រឹមត្រូវ!",
        icon: "error",
        showConfirmButton: false,
        timer: 1600,
      });
    }
  }

  const removeTimeTable = (e) => {
    const db = getDatabase();
    const id = user_id.current.value
    const imgUrl = user_img.current.value
    const nickname = user_nick
    const subs = set_user_sub.current.value
    const grade = user_g
    if (data_cell === 'cell1') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t1: null,
        img_mon_mor_t1: null,
        sub_mon_mor_t1: null,
        tname_mon_mor_t1: null,
        teacher_type_mon_mor_t1: null,
        t_grade_mon_mor_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t1: null,
        img_mon_mor_t1: null,
        sub_mon_mor_t1: null,
        tname_mon_mor_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t1: null,
          img_mon_mor_t1: null,
          sub_mon_mor_t1: null,
          tname_mon_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t1: null,
          img_mon_mor_t1: null,
          sub_mon_mor_t1: null,
          tname_mon_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t1: null,
          img_mon_mor_t1: null,
          sub_mon_mor_t1: null,
          tname_mon_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t1: null,
          img_mon_mor_t1: null,
          sub_mon_mor_t1: null,
          tname_mon_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t1: null,
            img_mon_mor_t1: null,
            sub_mon_mor_t1: null,
            tname_mon_mor_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell2') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t2: null,
        img_mon_mor_t2: null,
        sub_mon_mor_t2: null,
        tname_mon_mor_t2: null,
        t_grade_mon_mor_t2: null,
        teacher_type_mon_mor_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t2: null,
        img_mon_mor_t2: null,
        sub_mon_mor_t2: null,
        tname_mon_mor_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t2: null,
          img_mon_mor_t2: null,
          sub_mon_mor_t2: null,
          tname_mon_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t2: null,
          img_mon_mor_t2: null,
          sub_mon_mor_t2: null,
          tname_mon_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t2: null,
          img_mon_mor_t2: null,
          sub_mon_mor_t2: null,
          tname_mon_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t2: null,
          img_mon_mor_t2: null,
          sub_mon_mor_t2: null,
          tname_mon_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t2: null,
            img_mon_mor_t2: null,
            sub_mon_mor_t2: null,
            tname_mon_mor_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell3') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t3: null,
        img_mon_mor_t3: null,
        sub_mon_mor_t3: null,
        tname_mon_mor_t3: null,
        t_grade_mon_mor_t3: null,
        teacher_type_mon_mor_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t3: null,
        img_mon_mor_t3: null,
        sub_mon_mor_t3: null,
        tname_mon_mor_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t3: null,
          img_mon_mor_t3: null,
          sub_mon_mor_t3: null,
          tname_mon_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t3: null,
          img_mon_mor_t3: null,
          sub_mon_mor_t3: null,
          tname_mon_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t3: null,
          img_mon_mor_t3: null,
          sub_mon_mor_t3: null,
          tname_mon_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t3: null,
          img_mon_mor_t3: null,
          sub_mon_mor_t3: null,
          tname_mon_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t3: null,
            img_mon_mor_t3: null,
            sub_mon_mor_t3: null,
            tname_mon_mor_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell4') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_mor_t4: null,
        img_mon_mor_t4: null,
        sub_mon_mor_t4: null,
        tname_mon_mor_t4: null,
        t_grade_mon_mor_t4: null,
        teacher_type_mon_mor_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_mor_t4: null,
        img_mon_mor_t4: null,
        sub_mon_mor_t4: null,
        tname_mon_mor_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_mor_t4: null,
          img_mon_mor_t4: null,
          sub_mon_mor_t4: null,
          tname_mon_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_mor_t4: null,
          img_mon_mor_t4: null,
          sub_mon_mor_t4: null,
          tname_mon_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t4: null,
          img_mon_mor_t4: null,
          sub_mon_mor_t4: null,
          tname_mon_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_mor_t4: null,
          img_mon_mor_t4: null,
          sub_mon_mor_t4: null,
          tname_mon_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_mor_t4: null,
            img_mon_mor_t4: null,
            sub_mon_mor_t4: null,
            tname_mon_mor_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell5') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t1: null,
        img_mon_aft_t1: null,
        sub_mon_aft_t1: null,
        tname_mon_aft_t1: null,
        t_grade_mon_aft_t1: null,
        teacher_type_mon_aft_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t1: null,
        img_mon_aft_t1: null,
        sub_mon_aft_t1: null,
        tname_mon_aft_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t1: null,
          img_mon_aft_t1: null,
          sub_mon_aft_t1: null,
          tname_mon_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t1: null,
          img_mon_aft_t1: null,
          sub_mon_aft_t1: null,
          tname_mon_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t1: null,
          img_mon_aft_t1: null,
          sub_mon_aft_t1: null,
          tname_mon_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t1: null,
          img_mon_aft_t1: null,
          sub_mon_aft_t1: null,
          tname_mon_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t1: null,
            img_mon_aft_t1: null,
            sub_mon_aft_t1: null,
            tname_mon_aft_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell6') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t2: null,
        img_mon_aft_t2: null,
        sub_mon_aft_t2: null,
        tname_mon_aft_t2: null,
        t_grade_mon_aft_t2: null,
        teacher_type_mon_aft_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t2: null,
        img_mon_aft_t2: null,
        sub_mon_aft_t2: null,
        tname_mon_aft_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t2: null,
          img_mon_aft_t2: null,
          sub_mon_aft_t2: null,
          tname_mon_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t2: null,
          img_mon_aft_t2: null,
          sub_mon_aft_t2: null,
          tname_mon_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t2: null,
          img_mon_aft_t2: null,
          sub_mon_aft_t2: null,
          tname_mon_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t2: null,
          img_mon_aft_t2: null,
          sub_mon_aft_t2: null,
          tname_mon_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t2: null,
            img_mon_aft_t2: null,
            sub_mon_aft_t2: null,
            tname_mon_aft_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell7') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t3: null,
        img_mon_aft_t3: null,
        sub_mon_aft_t3: null,
        tname_mon_aft_t3: null,
        t_grade_mon_aft_t3: null,
        teacher_type_mon_aft_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t3: null,
        img_mon_aft_t3: null,
        sub_mon_aft_t3: null,
        tname_mon_aft_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t3: null,
          img_mon_aft_t3: null,
          sub_mon_aft_t3: null,
          tname_mon_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t3: null,
          img_mon_aft_t3: null,
          sub_mon_aft_t3: null,
          tname_mon_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t3: null,
          img_mon_aft_t3: null,
          sub_mon_aft_t3: null,
          tname_mon_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t3: null,
          img_mon_aft_t3: null,
          sub_mon_aft_t3: null,
          tname_mon_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t3: null,
            img_mon_aft_t3: null,
            sub_mon_aft_t3: null,
            tname_mon_aft_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell8') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_mon_aft_t4: null,
        img_mon_aft_t4: null,
        sub_mon_aft_t4: null,
        tname_mon_aft_t4: null,
        t_grade_mon_aft_t4: null,
        teacher_type_mon_aft_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_mon_aft_t4: null,
        img_mon_aft_t4: null,
        sub_mon_aft_t4: null,
        tname_mon_aft_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_mon_aft_t4: null,
          img_mon_aft_t4: null,
          sub_mon_aft_t4: null,
          tname_mon_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_mon_aft_t4: null,
          img_mon_aft_t4: null,
          sub_mon_aft_t4: null,
          tname_mon_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t4: null,
          img_mon_aft_t4: null,
          sub_mon_aft_t4: null,
          tname_mon_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_mon_aft_t4: null,
          img_mon_aft_t4: null,
          sub_mon_aft_t4: null,
          tname_mon_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_mon_aft_t4: null,
            img_mon_aft_t4: null,
            sub_mon_aft_t4: null,
            tname_mon_aft_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell9') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t1: null,
        img_tue_mor_t1: null,
        sub_tue_mor_t1: null,
        tname_tue_mor_t1: null,
        t_grade_tue_mor_t1: null,
        teacher_type_tue_mor_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t1: null,
        img_tue_mor_t1: null,
        sub_tue_mor_t1: null,
        tname_tue_mor_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t1: null,
          img_tue_mor_t1: null,
          sub_tue_mor_t1: null,
          tname_tue_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t1: null,
          img_tue_mor_t1: null,
          sub_tue_mor_t1: null,
          tname_tue_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t1: null,
          img_tue_mor_t1: null,
          sub_tue_mor_t1: null,
          tname_tue_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t1: null,
          img_tue_mor_t1: null,
          sub_tue_mor_t1: null,
          tname_tue_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t1: null,
            img_tue_mor_t1: null,
            sub_tue_mor_t1: null,
            tname_tue_mor_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell10') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t2: null,
        img_tue_mor_t2: null,
        sub_tue_mor_t2: null,
        tname_tue_mor_t2: null,
        t_grade_tue_mor_t2: null,
        teacher_type_tue_mor_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t2: null,
        img_tue_mor_t2: null,
        sub_tue_mor_t2: null,
        tname_tue_mor_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t2: null,
          img_tue_mor_t2: null,
          sub_tue_mor_t2: null,
          tname_tue_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t2: null,
          img_tue_mor_t2: null,
          sub_tue_mor_t2: null,
          tname_tue_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t2: null,
          img_tue_mor_t2: null,
          sub_tue_mor_t2: null,
          tname_tue_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t2: null,
          img_tue_mor_t2: null,
          sub_tue_mor_t2: null,
          tname_tue_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t2: null,
            img_tue_mor_t2: null,
            sub_tue_mor_t2: null,
            tname_tue_mor_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell11') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t3: null,
        img_tue_mor_t3: null,
        sub_tue_mor_t3: null,
        tname_tue_mor_t3: null,
        t_grade_tue_mor_t3: null,
        teacher_type_tue_mor_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t3: null,
        img_tue_mor_t3: null,
        sub_tue_mor_t3: null,
        tname_tue_mor_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t3: null,
          img_tue_mor_t3: null,
          sub_tue_mor_t3: null,
          tname_tue_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t3: null,
          img_tue_mor_t3: null,
          sub_tue_mor_t3: null,
          tname_tue_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t3: null,
          img_tue_mor_t3: null,
          sub_tue_mor_t3: null,
          tname_tue_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t3: null,
          img_tue_mor_t3: null,
          sub_tue_mor_t3: null,
          tname_tue_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t3: null,
            img_tue_mor_t3: null,
            sub_tue_mor_t3: null,
            tname_tue_mor_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell12') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_mor_t4: null,
        img_tue_mor_t4: null,
        sub_tue_mor_t4: null,
        tname_tue_mor_t4: null,
        t_grade_tue_mor_t4: null,
        teacher_type_tue_mor_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_mor_t4: null,
        img_tue_mor_t4: null,
        sub_tue_mor_t4: null,
        tname_tue_mor_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_mor_t4: null,
          img_tue_mor_t4: null,
          sub_tue_mor_t4: null,
          tname_tue_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_mor_t4: null,
          img_tue_mor_t4: null,
          sub_tue_mor_t4: null,
          tname_tue_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t4: null,
          img_tue_mor_t4: null,
          sub_tue_mor_t4: null,
          tname_tue_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_mor_t4: null,
          img_tue_mor_t4: null,
          sub_tue_mor_t4: null,
          tname_tue_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_mor_t4: null,
            img_tue_mor_t4: null,
            sub_tue_mor_t4: null,
            tname_tue_mor_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell13') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t1: null,
        img_tue_aft_t1: null,
        sub_tue_aft_t1: null,
        tname_tue_aft_t1: null,
        t_grade_tue_aft_t1: null,
        teacher_type_tue_aft_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t1: null,
        img_tue_aft_t1: null,
        sub_tue_aft_t1: null,
        tname_tue_aft_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t1: null,
          img_tue_aft_t1: null,
          sub_tue_aft_t1: null,
          tname_tue_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t1: null,
          img_tue_aft_t1: null,
          sub_tue_aft_t1: null,
          tname_tue_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t1: null,
          img_tue_aft_t1: null,
          sub_tue_aft_t1: null,
          tname_tue_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t1: null,
          img_tue_aft_t1: null,
          sub_tue_aft_t1: null,
          tname_tue_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t1: null,
            img_tue_aft_t1: null,
            sub_tue_aft_t1: null,
            tname_tue_aft_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell14') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t2: null,
        img_tue_aft_t2: null,
        sub_tue_aft_t2: null,
        tname_tue_aft_t2: null,
        t_grade_tue_aft_t2: null,
        teacher_type_tue_aft_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t2: null,
        img_tue_aft_t2: null,
        sub_tue_aft_t2: null,
        tname_tue_aft_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t2: null,
          img_tue_aft_t2: null,
          sub_tue_aft_t2: null,
          tname_tue_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t2: null,
          img_tue_aft_t2: null,
          sub_tue_aft_t2: null,
          tname_tue_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t2: null,
          img_tue_aft_t2: null,
          sub_tue_aft_t2: null,
          tname_tue_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t2: null,
          img_tue_aft_t2: null,
          sub_tue_aft_t2: null,
          tname_tue_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t2: null,
            img_tue_aft_t2: null,
            sub_tue_aft_t2: null,
            tname_tue_aft_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell15') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t3: null,
        img_tue_aft_t3: null,
        sub_tue_aft_t3: null,
        tname_tue_aft_t3: null,
        t_grade_tue_aft_t3: null,
        teacher_type_tue_aft_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t3: null,
        img_tue_aft_t3: null,
        sub_tue_aft_t3: null,
        tname_tue_aft_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t3: null,
          img_tue_aft_t3: null,
          sub_tue_aft_t3: null,
          tname_tue_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t3: null,
          img_tue_aft_t3: null,
          sub_tue_aft_t3: null,
          tname_tue_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t3: null,
          img_tue_aft_t3: null,
          sub_tue_aft_t3: null,
          tname_tue_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t3: null,
          img_tue_aft_t3: null,
          sub_tue_aft_t3: null,
          tname_tue_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t3: null,
            img_tue_aft_t3: null,
            sub_tue_aft_t3: null,
            tname_tue_aft_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell16') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_tue_aft_t4: null,
        img_tue_aft_t4: null,
        sub_tue_aft_t4: null,
        tname_tue_aft_t4: null,
        t_grade_tue_aft_t4: null,
        teacher_type_tue_aft_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_tue_aft_t4: null,
        img_tue_aft_t4: null,
        sub_tue_aft_t4: null,
        tname_tue_aft_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_tue_aft_t4: null,
          img_tue_aft_t4: null,
          sub_tue_aft_t4: null,
          tname_tue_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_tue_aft_t4: null,
          img_tue_aft_t4: null,
          sub_tue_aft_t4: null,
          tname_tue_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t4: null,
          img_tue_aft_t4: null,
          sub_tue_aft_t4: null,
          tname_tue_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_tue_aft_t4: null,
          img_tue_aft_t4: null,
          sub_tue_aft_t4: null,
          tname_tue_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_tue_aft_t4: null,
            img_tue_aft_t4: null,
            sub_tue_aft_t4: null,
            tname_tue_aft_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell17') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t1: null,
        img_wed_mor_t1: null,
        sub_wed_mor_t1: null,
        tname_wed_mor_t1: null,
        t_grade_wed_mor_t1: null,
        teacher_type_wed_mor_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t1: null,
        img_wed_mor_t1: null,
        sub_wed_mor_t1: null,
        tname_wed_mor_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t1: null,
          img_wed_mor_t1: null,
          sub_wed_mor_t1: null,
          tname_wed_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t1: null,
          img_wed_mor_t1: null,
          sub_wed_mor_t1: null,
          tname_wed_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t1: null,
          img_wed_mor_t1: null,
          sub_wed_mor_t1: null,
          tname_wed_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t1: null,
          img_wed_mor_t1: null,
          sub_wed_mor_t1: null,
          tname_wed_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t1: null,
            img_wed_mor_t1: null,
            sub_wed_mor_t1: null,
            tname_wed_mor_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell18') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t2: null,
        img_wed_mor_t2: null,
        sub_wed_mor_t2: null,
        tname_wed_mor_t2: null,
        t_grade_wed_mor_t2: null,
        teacher_type_wed_mor_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t2: null,
        img_wed_mor_t2: null,
        sub_wed_mor_t2: null,
        tname_wed_mor_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t2: null,
          img_wed_mor_t2: null,
          sub_wed_mor_t2: null,
          tname_wed_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t2: null,
          img_wed_mor_t2: null,
          sub_wed_mor_t2: null,
          tname_wed_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t2: null,
          img_wed_mor_t2: null,
          sub_wed_mor_t2: null,
          tname_wed_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t2: null,
          img_wed_mor_t2: null,
          sub_wed_mor_t2: null,
          tname_wed_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t2: null,
            img_wed_mor_t2: null,
            sub_wed_mor_t2: null,
            tname_wed_mor_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell19') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t3: null,
        img_wed_mor_t3: null,
        sub_wed_mor_t3: null,
        tname_wed_mor_t3: null,
        t_grade_wed_mor_t3: null,
        teacher_type_wed_mor_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t3: null,
        img_wed_mor_t3: null,
        sub_wed_mor_t3: null,
        tname_wed_mor_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t3: null,
          img_wed_mor_t3: null,
          sub_wed_mor_t3: null,
          tname_wed_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t3: null,
          img_wed_mor_t3: null,
          sub_wed_mor_t3: null,
          tname_wed_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t3: null,
          img_wed_mor_t3: null,
          sub_wed_mor_t3: null,
          tname_wed_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t3: null,
          img_wed_mor_t3: null,
          sub_wed_mor_t3: null,
          tname_wed_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t3: null,
            img_wed_mor_t3: null,
            sub_wed_mor_t3: null,
            tname_wed_mor_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell20') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_mor_t4: null,
        img_wed_mor_t4: null,
        sub_wed_mor_t4: null,
        tname_wed_mor_t4: null,
        t_grade_wed_mor_t4: null,
        teacher_type_wed_mor_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_mor_t4: null,
        img_wed_mor_t4: null,
        sub_wed_mor_t4: null,
        tname_wed_mor_t4: id,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_mor_t4: null,
          img_wed_mor_t4: null,
          sub_wed_mor_t4: null,
          tname_wed_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_mor_t4: null,
          img_wed_mor_t4: null,
          sub_wed_mor_t4: null,
          tname_wed_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t4: null,
          img_wed_mor_t4: null,
          sub_wed_mor_t4: null,
          tname_wed_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_mor_t4: null,
          img_wed_mor_t4: null,
          sub_wed_mor_t4: null,
          tname_wed_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_mor_t4: null,
            img_wed_mor_t4: null,
            sub_wed_mor_t4: null,
            tname_wed_mor_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell21') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t1: null,
        img_wed_aft_t1: null,
        sub_wed_aft_t1: null,
        tname_wed_aft_t1: null,
        t_grade_wed_aft_t1: null,
        teacher_type_wed_aft_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t1: null,
        img_wed_aft_t1: null,
        sub_wed_aft_t1: null,
        tname_wed_aft_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t1: null,
          img_wed_aft_t1: null,
          sub_wed_aft_t1: null,
          tname_wed_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t1: null,
          img_wed_aft_t1: null,
          sub_wed_aft_t1: null,
          tname_wed_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t1: null,
          img_wed_aft_t1: null,
          sub_wed_aft_t1: null,
          tname_wed_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t1: null,
          img_wed_aft_t1: null,
          sub_wed_aft_t1: null,
          tname_wed_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t1: null,
            img_wed_aft_t1: null,
            sub_wed_aft_t1: null,
            tname_wed_aft_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell22') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t2: null,
        img_wed_aft_t2: null,
        sub_wed_aft_t2: null,
        tname_wed_aft_t2: null,
        t_grade_wed_aft_t2: null,
        teacher_type_wed_aft_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t2: null,
        img_wed_aft_t2: null,
        sub_wed_aft_t2: null,
        tname_wed_aft_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t2: null,
          img_wed_aft_t2: null,
          sub_wed_aft_t2: null,
          tname_wed_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t2: null,
          img_wed_aft_t2: null,
          sub_wed_aft_t2: null,
          tname_wed_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t2: null,
          img_wed_aft_t2: null,
          sub_wed_aft_t2: null,
          tname_wed_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t2: null,
          img_wed_aft_t2: null,
          sub_wed_aft_t2: null,
          tname_wed_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t2: null,
            img_wed_aft_t2: null,
            sub_wed_aft_t2: null,
            tname_wed_aft_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell23') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t3: null,
        img_wed_aft_t3: null,
        sub_wed_aft_t3: null,
        tname_wed_aft_t3: null,
        t_grade_wed_aft_t3: null,
        teacher_type_wed_aft_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t3: null,
        img_wed_aft_t3: null,
        sub_wed_aft_t3: null,
        tname_wed_aft_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t3: null,
          img_wed_aft_t3: null,
          sub_wed_aft_t3: null,
          tname_wed_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t3: null,
          img_wed_aft_t3: null,
          sub_wed_aft_t3: null,
          tname_wed_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t3: null,
          img_wed_aft_t3: null,
          sub_wed_aft_t3: null,
          tname_wed_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t3: null,
          img_wed_aft_t3: null,
          sub_wed_aft_t3: null,
          tname_wed_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t3: null,
            img_wed_aft_t3: null,
            sub_wed_aft_t3: null,
            tname_wed_aft_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell24') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_wed_aft_t4: null,
        img_wed_aft_t4: null,
        sub_wed_aft_t4: null,
        tname_wed_aft_t4: null,
        t_grade_wed_aft_t4: null,
        teacher_type_wed_aft_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_wed_aft_t4: null,
        img_wed_aft_t4: null,
        sub_wed_aft_t4: null,
        tname_wed_aft_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_wed_aft_t4: null,
          img_wed_aft_t4: null,
          sub_wed_aft_t4: null,
          tname_wed_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_wed_aft_t4: null,
          img_wed_aft_t4: null,
          sub_wed_aft_t4: null,
          tname_wed_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t4: null,
          img_wed_aft_t4: null,
          sub_wed_aft_t4: null,
          tname_wed_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_wed_aft_t4: null,
          img_wed_aft_t4: null,
          sub_wed_aft_t4: null,
          tname_wed_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_wed_aft_t4: null,
            img_wed_aft_t4: null,
            sub_wed_aft_t4: null,
            tname_wed_aft_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell25') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t1: null,
        img_thu_mor_t1: null,
        sub_thu_mor_t1: null,
        tname_thu_mor_t1: null,
        t_grade_thu_mor_t1: null,
        teacher_type_thu_mor_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t1: null,
        img_thu_mor_t1: null,
        sub_thu_mor_t1: null,
        tname_thu_mor_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t1: null,
          img_thu_mor_t1: null,
          sub_thu_mor_t1: null,
          tname_thu_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t1: null,
          img_thu_mor_t1: null,
          sub_thu_mor_t1: null,
          tname_thu_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t1: null,
          img_thu_mor_t1: null,
          sub_thu_mor_t1: null,
          tname_thu_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t1: null,
          img_thu_mor_t1: null,
          sub_thu_mor_t1: null,
          tname_thu_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t1: null,
            img_thu_mor_t1: null,
            sub_thu_mor_t1: null,
            tname_thu_mor_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell26') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t2: null,
        img_thu_mor_t2: null,
        sub_thu_mor_t2: null,
        tname_thu_mor_t2: null,
        t_grade_thu_mor_t2: null,
        teacher_type_thu_mor_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t2: null,
        img_thu_mor_t2: null,
        sub_thu_mor_t2: null,
        tname_thu_mor_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t2: null,
          img_thu_mor_t2: null,
          sub_thu_mor_t2: null,
          tname_thu_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t2: null,
          img_thu_mor_t2: null,
          sub_thu_mor_t2: null,
          tname_thu_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t2: null,
          img_thu_mor_t2: null,
          sub_thu_mor_t2: null,
          tname_thu_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t2: null,
          img_thu_mor_t2: null,
          sub_thu_mor_t2: null,
          tname_thu_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t2: null,
            img_thu_mor_t2: null,
            sub_thu_mor_t2: null,
            tname_thu_mor_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell27') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t3: null,
        img_thu_mor_t3: null,
        sub_thu_mor_t3: null,
        tname_thu_mor_t3: null,
        t_grade_thu_mor_t3: null,
        teacher_type_thu_mor_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t3: null,
        img_thu_mor_t3: null,
        sub_thu_mor_t3: null,
        tname_thu_mor_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t3: null,
          img_thu_mor_t3: null,
          sub_thu_mor_t3: null,
          tname_thu_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t3: null,
          img_thu_mor_t3: null,
          sub_thu_mor_t3: null,
          tname_thu_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t3: null,
          img_thu_mor_t3: null,
          sub_thu_mor_t3: null,
          tname_thu_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t3: null,
          img_thu_mor_t3: null,
          sub_thu_mor_t3: null,
          tname_thu_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t3: null,
            img_thu_mor_t3: null,
            sub_thu_mor_t3: null,
            tname_thu_mor_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell28') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_mor_t4: null,
        img_thu_mor_t4: null,
        sub_thu_mor_t4: null,
        tname_thu_mor_t4: null,
        t_grade_thu_mor_t4: null,
        teacher_type_thu_mor_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_mor_t4: null,
        img_thu_mor_t4: null,
        sub_thu_mor_t4: null,
        tname_thu_mor_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_mor_t4: null,
          img_thu_mor_t4: null,
          sub_thu_mor_t4: null,
          tname_thu_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_mor_t4: null,
          img_thu_mor_t4: null,
          sub_thu_mor_t4: null,
          tname_thu_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t4: null,
          img_thu_mor_t4: null,
          sub_thu_mor_t4: null,
          tname_thu_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_mor_t4: null,
          img_thu_mor_t4: null,
          sub_thu_mor_t4: null,
          tname_thu_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_mor_t4: null,
            img_thu_mor_t4: null,
            sub_thu_mor_t4: null,
            tname_thu_mor_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell29') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t1: null,
        img_thu_aft_t1: null,
        sub_thu_aft_t1: null,
        tname_thu_aft_t1: null,
        t_grade_thu_aft_t1: null,
        teacher_type_thu_aft_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t1: null,
        img_thu_aft_t1: null,
        sub_thu_aft_t1: null,
        tname_thu_aft_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t1: null,
          img_thu_aft_t1: null,
          sub_thu_aft_t1: null,
          tname_thu_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t1: null,
          img_thu_aft_t1: null,
          sub_thu_aft_t1: null,
          tname_thu_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t1: null,
          img_thu_aft_t1: null,
          sub_thu_aft_t1: null,
          tname_thu_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t1: null,
          img_thu_aft_t1: null,
          sub_thu_aft_t1: null,
          tname_thu_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t1: null,
            img_thu_aft_t1: null,
            sub_thu_aft_t1: null,
            tname_thu_aft_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell30') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t2: null,
        img_thu_aft_t2: null,
        sub_thu_aft_t2: null,
        tname_thu_aft_t2: null,
        t_grade_thu_aft_t2: null,
        teacher_type_thu_aft_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t2: null,
        img_thu_aft_t2: null,
        sub_thu_aft_t2: null,
        tname_thu_aft_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t2: null,
          img_thu_aft_t2: null,
          sub_thu_aft_t2: null,
          tname_thu_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t2: null,
          img_thu_aft_t2: null,
          sub_thu_aft_t2: null,
          tname_thu_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t2: null,
          img_thu_aft_t2: null,
          sub_thu_aft_t2: null,
          tname_thu_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t2: null,
          img_thu_aft_t2: null,
          sub_thu_aft_t2: null,
          tname_thu_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t2: null,
            img_thu_aft_t2: null,
            sub_thu_aft_t2: null,
            tname_thu_aft_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell31') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t3: null,
        img_thu_aft_t3: null,
        sub_thu_aft_t3: null,
        tname_thu_aft_t3: null,
        t_grade_thu_aft_t3: null,
        teacher_type_thu_aft_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t3: null,
        img_thu_aft_t3: null,
        sub_thu_aft_t3: null,
        tname_thu_aft_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t3: null,
          img_thu_aft_t3: null,
          sub_thu_aft_t3: null,
          tname_thu_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t3: null,
          img_thu_aft_t3: null,
          sub_thu_aft_t3: null,
          tname_thu_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t3: null,
          img_thu_aft_t3: null,
          sub_thu_aft_t3: null,
          tname_thu_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t3: null,
          img_thu_aft_t3: null,
          sub_thu_aft_t3: null,
          tname_thu_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t3: null,
            img_thu_aft_t3: null,
            sub_thu_aft_t3: null,
            tname_thu_aft_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell32') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_thu_aft_t4: null,
        img_thu_aft_t4: null,
        sub_thu_aft_t4: null,
        tname_thu_aft_t4: null,
        t_grade_thu_aft_t4: null,
        teacher_type_thu_aft_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_thu_aft_t4: null,
        img_thu_aft_t4: null,
        sub_thu_aft_t4: null,
        tname_thu_aft_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_thu_aft_t4: null,
          img_thu_aft_t4: null,
          sub_thu_aft_t4: null,
          tname_thu_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_thu_aft_t4: null,
          img_thu_aft_t4: null,
          sub_thu_aft_t4: null,
          tname_thu_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t4: null,
          img_thu_aft_t4: null,
          sub_thu_aft_t4: null,
          tname_thu_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_thu_aft_t4: null,
          img_thu_aft_t4: null,
          sub_thu_aft_t4: null,
          tname_thu_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_thu_aft_t4: null,
            img_thu_aft_t4: null,
            sub_thu_aft_t4: null,
            tname_thu_aft_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell33') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t1: null,
        img_fri_mor_t1: null,
        sub_fri_mor_t1: null,
        tname_fri_mor_t1: null,
        t_grade_fri_mor_t1: null,
        teacher_type_fri_mor_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t1: null,
        img_fri_mor_t1: null,
        sub_fri_mor_t1: null,
        tname_fri_mor_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t1: null,
          img_fri_mor_t1: null,
          sub_fri_mor_t1: null,
          tname_fri_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t1: null,
          img_fri_mor_t1: null,
          sub_fri_mor_t1: null,
          tname_fri_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t1: null,
          img_fri_mor_t1: null,
          sub_fri_mor_t1: null,
          tname_fri_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t1: null,
          img_fri_mor_t1: null,
          sub_fri_mor_t1: null,
          tname_fri_mor_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t1: null,
            img_fri_mor_t1: null,
            sub_fri_mor_t1: null,
            tname_fri_mor_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell34') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t2: null,
        img_fri_mor_t2: null,
        sub_fri_mor_t2: null,
        tname_fri_mor_t2: null,
        t_grade_fri_mor_t2: null,
        teacher_type_fri_mor_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t2: null,
        img_fri_mor_t2: null,
        sub_fri_mor_t2: null,
        tname_fri_mor_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t2: null,
          img_fri_mor_t2: null,
          sub_fri_mor_t2: null,
          tname_fri_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t2: null,
          img_fri_mor_t2: null,
          sub_fri_mor_t2: null,
          tname_fri_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t2: null,
          img_fri_mor_t2: null,
          sub_fri_mor_t2: null,
          tname_fri_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t2: null,
          img_fri_mor_t2: null,
          sub_fri_mor_t2: null,
          tname_fri_mor_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t2: null,
            img_fri_mor_t2: null,
            sub_fri_mor_t2: null,
            tname_fri_mor_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell35') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t3: null,
        img_fri_mor_t3: null,
        sub_fri_mor_t3: null,
        tname_fri_mor_t3: null,
        t_grade_fri_mor_t3: null,
        teacher_type_fri_mor_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t3: null,
        img_fri_mor_t3: null,
        sub_fri_mor_t3: null,
        tname_fri_mor_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t3: null,
          img_fri_mor_t3: null,
          sub_fri_mor_t3: null,
          tname_fri_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t3: null,
          img_fri_mor_t3: null,
          sub_fri_mor_t3: null,
          tname_fri_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t3: null,
          img_fri_mor_t3: null,
          sub_fri_mor_t3: null,
          tname_fri_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t3: null,
          img_fri_mor_t3: null,
          sub_fri_mor_t3: null,
          tname_fri_mor_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t3: null,
            img_fri_mor_t3: null,
            sub_fri_mor_t3: null,
            tname_fri_mor_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell36') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_mor_t4: null,
        img_fri_mor_t4: null,
        sub_fri_mor_t4: null,
        tname_fri_mor_t4: null,
        t_grade_fri_mor_t4: null,
        teacher_type_fri_mor_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_mor_t4: null,
        img_fri_mor_t4: null,
        sub_fri_mor_t4: null,
        tname_fri_mor_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_mor_t4: null,
          img_fri_mor_t4: null,
          sub_fri_mor_t4: null,
          tname_fri_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_mor_t4: null,
          img_fri_mor_t4: null,
          sub_fri_mor_t4: null,
          tname_fri_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t4: null,
          img_fri_mor_t4: null,
          sub_fri_mor_t4: null,
          tname_fri_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_mor_t4: null,
          img_fri_mor_t4: null,
          sub_fri_mor_t4: null,
          tname_fri_mor_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_mor_t4: null,
            img_fri_mor_t4: null,
            sub_fri_mor_t4: null,
            tname_fri_mor_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell37') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t1: null,
        img_fri_aft_t1: null,
        sub_fri_aft_t1: null,
        tname_fri_aft_t1: null,
        t_grade_fri_aft_t1: null,
        teacher_type_fri_aft_t1: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t1: null,
        img_fri_aft_t1: null,
        sub_fri_aft_t1: null,
        tname_fri_aft_t1: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t1: null,
          img_fri_aft_t1: null,
          sub_fri_aft_t1: null,
          tname_fri_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t1: null,
          img_fri_aft_t1: null,
          sub_fri_aft_t1: null,
          tname_fri_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t1: null,
          img_fri_aft_t1: null,
          sub_fri_aft_t1: null,
          tname_fri_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t1: null,
          img_fri_aft_t1: null,
          sub_fri_aft_t1: null,
          tname_fri_aft_t1: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t1: null,
            img_fri_aft_t1: null,
            sub_fri_aft_t1: null,
            tname_fri_aft_t1: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell38') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t2: null,
        img_fri_aft_t2: null,
        sub_fri_aft_t2: null,
        tname_fri_aft_t2: null,
        t_grade_fri_aft_t2: null,
        teacher_type_fri_aft_t2: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t2: null,
        img_fri_aft_t2: null,
        sub_fri_aft_t2: null,
        tname_fri_aft_t2: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t2: null,
          img_fri_aft_t2: null,
          sub_fri_aft_t2: null,
          tname_fri_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t2: null,
          img_fri_aft_t2: null,
          sub_fri_aft_t2: null,
          tname_fri_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t2: null,
          img_fri_aft_t2: null,
          sub_fri_aft_t2: null,
          tname_fri_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t2: null,
          img_fri_aft_t2: null,
          sub_fri_aft_t2: null,
          tname_fri_aft_t2: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t2: null,
            img_fri_aft_t2: null,
            sub_fri_aft_t2: null,
            tname_fri_aft_t2: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell39') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t3: null,
        img_fri_aft_t3: null,
        sub_fri_aft_t3: null,
        tname_fri_aft_t3: null,
        t_grade_fri_aft_t3: null,
        teacher_type_fri_aft_t3: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t3: null,
        img_fri_aft_t3: null,
        sub_fri_aft_t3: null,
        tname_fri_aft_t3: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t3: null,
          img_fri_aft_t3: null,
          sub_fri_aft_t3: null,
          tname_fri_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t3: null,
          img_fri_aft_t3: null,
          sub_fri_aft_t3: null,
          tname_fri_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t3: null,
          img_fri_aft_t3: null,
          sub_fri_aft_t3: null,
          tname_fri_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t3: null,
          img_fri_aft_t3: null,
          sub_fri_aft_t3: null,
          tname_fri_aft_t3: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t3: null,
            img_fri_aft_t3: null,
            sub_fri_aft_t3: null,
            tname_fri_aft_t3: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else if (data_cell === 'cell40') {

      Swal.fire({
        text: "ព័ត៍មានបានបញ្ចូលត្រឹមត្រូវ!",
        icon: "success",
        showConfirmButton: false,
        timer: 2200,
      });
      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/${selectTimeTable}/` + grade), {
        grade_fri_aft_t4: null,
        img_fri_aft_t4: null,
        sub_fri_aft_t4: null,
        tname_fri_aft_t4: null,
        t_grade_fri_aft_t4: null,
        teacher_type_fri_aft_t4: null,
      });

      update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id), {
        grade_fri_aft_t4: null,
        img_fri_aft_t4: null,
        sub_fri_aft_t4: null,
        tname_fri_aft_t4: null,
        id: id,
        t_grade: getT_grade,
        teacher_type: getteacher_type
      });
      if (userType === 'no') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/អនុវិទ្យាល័យ/` + id), {
          grade_fri_aft_t4: null,
          img_fri_aft_t4: null,
          sub_fri_aft_t4: null,
          tname_fri_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (userType === 'ok') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/វិទ្យាល័យ/` + id), {
          grade_fri_aft_t4: null,
          img_fri_aft_t4: null,
          sub_fri_aft_t4: null,
          tname_fri_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }

      if (subs == 'E') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t4: null,
          img_fri_aft_t4: null,
          sub_fri_aft_t4: null,
          tname_fri_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (subs == 'PE') {
        update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
          grade_fri_aft_t4: null,
          img_fri_aft_t4: null,
          sub_fri_aft_t4: null,
          tname_fri_aft_t4: null,
          id: id,
          t_grade: getT_grade,
          teacher_type: getteacher_type
        });
      }
      if (getteacher_type === 'english') {
        if (subs == 'Di') {
          update(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_english/${selectTimeTable}/` + id), {
            grade_fri_aft_t4: null,
            img_fri_aft_t4: null,
            sub_fri_aft_t4: null,
            tname_fri_aft_t4: null,
            id: id,
            t_grade: getT_grade,
            teacher_type: getteacher_type
          });
        }
      }
    }
    else {
      Swal.fire({
        text: "ព័ត៍មានលុបមិនត្រឹមត្រូវ!",
        icon: "error",
        showConfirmButton: false,
        timer: 1600,
      });
    }
  }

  const PrintPramary = () => {
    const printContent = document.getElementById('myTable');
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
        <head>
        <title>កាលវិភាគរួម${selectTimeTable}</title>
        <style>
        @media print {
            @page {
                size: landscape;
                margin-top: 3mm;
                margin-right: 4mm;
                margin-bottom: 3mm;
                margin-left: 4mm;
            }
            }
            @font-face {
            font-family: "KhOSSiemreap";
            src: url("https://res.cloudinary.com/salamomschool/raw/upload/v1710682946/fonts/01a09003da4063952afa7734f4f393af.ttf");
            font-weight: normal
            }
            * {
            font-family: KhOSSiemreap
            }
            body {
                -webkit-print-color-adjust: exact; }
            table {
                width: 100%;
                border-collapse: collapse;
              }
            th, td {
                border: 1px solid black;
                color: black;
                text-align: center;
                line-height: 1.2;
                padding: 2px;
                font-size: 1.6wh;

              }
            #show_data_print td:nth-child(2){
                text-align: left;
                width: 10rem;
                padding: 5px;
            }
            .noBorder{
              border: 0;
            }
            .text-start{
              text-align: left;
              width: 40rem;
            }
            .text-end{
              text-align: right;
            }
            .text-mid{
              text-align: center;
            }
        </style>
        </head><body>
        <table class="table noBorder">
            <thead class="noBorder">
                <tr class="noBorder">
                  <th class="noBorder text-start">Kosal, ${Title} (${selectTimeTableYear})</th>
                  <th class="noBorder text-mid">${gradeTitle}</th>
                  <th class="noBorder text-end">Issue date ${pickupDate}</th>
                </tr>
            </thead>
        </table>

        `);
    newWindow.document.write(printContent.outerHTML);
    newWindow.document.write(`</body></html>`);
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => {
      newWindow.print();
    }, 500);
    // newWindow.close();

  }

  const PrintEnglish = () => {
    const printContent = document.getElementById('myTableEnglish');
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
        <head>
        <title>កាលវិភាគរួម${selectTimeTable}</title>
        <style>
        @media print {
            @page {
                size: landscape;
                margin-top: 3mm;
                margin-right: 4mm;
                margin-bottom: 3mm;
                margin-left: 4mm;
            }
            }
            @font-face {
            font-family: "KhOSSiemreap";
            src: url("https://res.cloudinary.com/salamomschool/raw/upload/v1710682946/fonts/01a09003da4063952afa7734f4f393af.ttf");
            font-weight: normal
            }
            * {
            font-family: KhOSSiemreap
            }
            body {
                -webkit-print-color-adjust: exact; }
            table {
                width: 100%;
                border-collapse: collapse;
              }
            th, td {
                border: 1px solid black;
                color: black;
                text-align: center;
                line-height: 1.2;
                padding: 2px;
                font-size: 1.6wh;

              }
            #show_data_print td:nth-child(2){
                text-align: left;
                width: 10rem;
                padding: 5px;
            }
            .noBorder{
              border: 0;
            }
            .text-start{
              text-align: left;
              width: 40rem;
            }
            .text-end{
              text-align: right;
            }
            .text-mid{
              text-align: center;
            }
            .color1{
              color: rgb(179, 37, 214);
            }
            .color2{
              color: rgb(235, 25, 25);
            }
            .color3{
              color: darkred;
            }
            .color4{
              color: darkblue;
            }

        </style>
        </head><body>
        <table class="table noBorder">
            <thead class="noBorder">
                <tr class="noBorder">
                  <th class="noBorder text-start">Kosal, ${TitleEn} (${selectTimeTableYear})</th>
                  <th class="noBorder text-mid">${gradeTitleEn}</th>
                  <th class="noBorder text-end">Issue date ${pickupDate}</th>
                </tr>
            </thead>
        </table>

        `);
    newWindow.document.write(printContent.outerHTML);
    newWindow.document.write(`</body></html>`);
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => {
      newWindow.print();
    }, 500);
    // newWindow.close();

  }

  setTimeout(() => {
    var get_date_num = document.getElementById('get_date_num')
    var get_month = document.getElementById('get_month')
    var get_year = document.getElementById('get_year')
    document.getElementById('printingDate').addEventListener('change', () => {
      var d = document.getElementById('printingDate').value;
      function convertToKhmerNumeral(number) {
        if (number < 0) {
          return "-" + convertToKhmerNumeral(Math.abs(number)); // Handle negative numbers
        }
        const khmerDigits = {
          0: "០",
          1: "១",
          2: "២",
          3: "៣",
          4: "៤",
          5: "៥",
          6: "៦",
          7: "៧",
          8: "៨",
          9: "៩"
        };

        if (number < 10) {
          return khmerDigits[number]; // Use dictionary for single digits
        } else {
          const tensDigit = Math.floor(number / 10);
          const onesDigit = number % 10;
          return khmerDigits[tensDigit] + khmerDigits[onesDigit]; // Combine digits
        }
      }

      function convertYear(number) {
        if (number < 0) {
          return "-" + convertYear(Math.abs(number)); // Handle negative numbers
        }

        const khmerDigits = {
          0: "០",
          1: "១",
          2: "២",
          3: "៣",
          4: "៤",
          5: "៥",
          6: "៦",
          7: "៧",
          8: "៨",
          9: "៩"
        };

        // Handle numbers of any digit length:
        let result = "";
        while (number > 0) {
          const digit = number % 10;
          result = khmerDigits[digit] + result; // Append digits in reverse order
          number = Math.floor(number / 10);
        }

        return result;
      }
      if (d) {
        let date = new Date(d);
        let year = date.getFullYear();
        let day = date.getDate();
        let month = date.getMonth();

        if (month == 0) { month = 'មករា' };
        if (month == 1) { month = 'កុម្ភៈ' };
        if (month == 2) { month = 'មីនា' };
        if (month == 3) { month = 'មេសា' };
        if (month == 4) { month = 'ឧសភា' };
        if (month == 5) { month = 'មិថុនា' };
        if (month == 6) { month = 'កក្កដា' };
        if (month == 7) { month = 'សីហា' };
        if (month == 8) { month = 'កញ្ញា' };
        if (month == 9) { month = 'តុលា' };
        if (month == 10) { month = 'វិច្ឆិកា' };
        if (month == 11) { month = 'ធ្នូ' };
        let get_day_kh = convertToKhmerNumeral(day);
        get_day_kh = get_day_kh.toString().padStart(2, '0')
        let get_year_kh = convertYear(year);
        localStorage.setItem('get_day_kh_admin', get_day_kh);
        localStorage.setItem('month_admin', month);
        localStorage.setItem('get_year_kh_admin', get_year_kh);
        get_date_num.innerText = get_day_kh
        get_month.innerText = month
        get_year.innerText = get_year_kh

      }


    })
    let d1 = localStorage.getItem('get_day_kh_admin');
    let d2 = localStorage.getItem('month_admin');
    let d3 = localStorage.getItem('get_year_kh_admin');

    // if (d1) {
    //   get_date_num.innerText = d1
    // }
    // if (d2) {
    //   get_month.innerText = d2

    // }
    // if (d3) {
    //   get_year.innerText = d3

    // }

  }, 1000);
  function PrintKh() {
    const printContent = document.getElementById('courseKh');
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>កាលវិភាគរួម${selectTimeTable}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>

        <style>
        @media print {
           @media print {
            @page {
                size: A4;
                margin-top: 3mm;
                margin-right: 4mm;
                margin-bottom: 3mm;
                margin-left: 4mm;
                transform: scale(0.1);
            }
            body {
                transform: scale(0.95); /* Adjust scaling as needed */
            }
        }

        @font-face {
            font-family: "KhOSSiemreap";
            src: url("https://res.cloudinary.com/salamomschool/raw/upload/v1710682946/fonts/01a09003da4063952afa7734f4f393af.ttf");
            font-weight: normal
        }
        @font-face {
            font-family: "kh moul";
            src: url("https://res.cloudinary.com/salamomschool/raw/upload/v1711085952/fonts/kh%20moul.TTF");
            font-weight: normal
        }

        * {
            font-family: KhOSSiemreap
        }
        .pavachana {
            font-family: kh moul
        }
        body {
            -webkit-print-color-adjust: exact;
        }

        table {
            border-collapse: collapse;
            line-height: 1;
            padding: 20dvh;
        }

        th,
        td,
        tr {
            border: 0px solid black;
            color: black;
            text-align: center;
            padding: 8px;
        }

        #show_data_print td:nth-child(2) {
            text-align: left;
            width: 10vh;
            padding: 20dvh;
        }
        .head_table{
            font-size: 1.6vw;
            line-height: 1;
            padding: 20dvh;
        }
        .text_table{
            font-size: 1.6vw;
            line-height: 1;
            padding: 20dvh;
        }
        .line_limit{
            width: 28vh;
        }
        .line_limit2{
            width: 20vh;
        }
        .title{
            font-size: 2.6vw;
            font-family:kh moul;
            color: darkblue;
          vertical-align:middle;
          text-align: center;


        }
        .mytr {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .textMiddle{
          vertical-align:middle;
        }
        .sb-color{
          color: darkblue;
        }
        .logo{
          width: 8vw;
        }
        .myLogo{
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .fontKH{
            font-family:kh moul;
        }
                    .container-principal-sign {
        position: relative;
          top: 15%;

        }
        .sign-imag{
          position: absolute;
          display: block;
          width: 30vw;
          height: auto;
          }
          .place-sign{
          position: absolute;
          display: block;
          width: 30vw;
          height: auto;
          left: 10vw;
        }
          .overlay-text {
          position: absolute; /* Positions the text on top of the image */
          top: 30%;
          margin-top: 1.8vw;
          left: 50%;
          font-weight: bold;
          transform: translate(-50%, -50%); /* Centers the text within the image */
          padding: 10px 20px;
          text-align: center;
        }

        .myKhmoul {
          font-family: kh moul
        }

            }
        </style>
        </head>
        <body>
            <div>
        <table class="table table-borderless head_table">
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th class="pavachana">ព្រះរាជាណាចក្រកម្ពុជា</th>
                </tr>
                <tr>
                    <th class="text-start">មន្ទីអប់រំយុវជន និង កីឡា រាជធានីភ្នំពេញ</th>
                    <th></th>
                    <th class="pavachana">ជាតិ សាសនា ព្រះមហាក្សត្រ</th>
                </tr>
                <tr>
                    <th class="text-start line_limit">ការិយាល័យអប់រំយុវជន និងកីឡានៃរដ្ឋបាលខណ្ឌសែនសុខ</th>
                    <th></th>
                    <th><img src="https://res.cloudinary.com/salamomschool/image/upload/v1711107157/fonts/takteng.png.png" style="width: 10vh;" alt="image"></th>
                </tr>
                <tr>
                    <th class="text-start">មត្តេយ្យ បឋម និងមធ្យមសិក្សាសាលាមុំ</th>
                    <th class="line_limit2"></th>
                    <th></th>
                </tr>
                <tr>
                    <th class="text-start"></th>
                    <th></th>
                </tr>
            </thead>
            </table>
            <table class="table table-borderless head_table">
              <thead>
                <tr>
                  <th class="text-end"><img src="https://res.cloudinary.com/salamomschool/image/upload/v1714370275/salamomlogo.png" class="text-end logo"></th>
                  <th class="title"
                    style="color:darkblue;"
                  >កាលវិភាគសិក្សាថ្នាក់ទី ${showGradePrint} ឆ្នាំសិក្សា ${khYear}</th>

                </tr>
              </thead>
            </table>
            </div>

        `);
    newWindow.document.write(printContent.outerHTML);
    newWindow.document.write(`
                  <table class="table table-borderless border-dark text_table ">
                  <thead>

                      <tr>
                          <th style="width:35vh;"></th>
                          <th></th>
                          <th class="text-center text_table">រាជធានីភ្នំពេញ, ថ្ងៃទី
                              <span id="get_date_num" style="color: blue;"></span>
                              ខែ <span id="get_month" style="color: blue;"></span>
                              ឆ្នាំ <span id="get_year" style="color: blue;"></span>
                          </th>
                      </tr>
                      <tr>
                          <th style="width:35vh;" class="text-center text_table">
                              </th>
                          <th></th>
                          <th class="text-center text_table pavachana">
                          <div class="container-principal-sign">
                          <div class="place-sign">
                          <img class="sign-imag" src="https://res.cloudinary.com/salamomschool/image/upload/v1720781504/principleSign2.png" />
                          </div>
                          <div class="overlay-text">
                          <p>នាយិកាសាលា</p>
                          </div>
                          </div>
                          </th>
                      </tr>
                      <tr>
                          <th style="width:35vh;" class="text-center text_table">
                              </th>
                          <th></th>
                          <th class="text-center text_table"></th>
                      </tr>
                  </thead>
              </table>
            <script>
                  let d1 = localStorage.getItem('get_day_kh_admin');
                  let d2 = localStorage.getItem('month_admin');
                  let d3 = localStorage.getItem('get_year_kh_admin');
                  var get_date_num = document.getElementById('get_date_num')
                  var get_month = document.getElementById('get_month')
                  var get_year = document.getElementById('get_year')
                  get_date_num.innerText = d1;
                  get_month.innerText = d2;
                  get_year.innerText = d3;
            </script>
    </body></html>`);
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => {
      newWindow.print();
    }, 1000);
    // newWindow.close();

  }
  const BtnYear = () => {

    return (
      <>
        <select className="btn btn-success btn-sm text-center me-3"
          value={upgradeYear}
          onChange={e => {
            window.location.reload()
            localStorage.setItem('yearUpgrade', e.target.value)
            setupgradeYear(e.target.value)
          }}
          style={{
            color: "white",
            lineHeight: "1",

          }}
        >
          <option>ជ្រើសរើសឆ្នាំសិក្សា</option>
          {dataYear.map((d, index) => (
            <option value={d.yearEn}>{d.yearKh}</option>
          ))}

        </select>
      </>
    )
  }

  const UpgradeCourse = () => {
    const uploadData = () => {
      Swal.fire({
        title: "តើអ្នកប្រាកដឬ?",
        showCancelButton: true,
        confirmButtonText: "បញ្ជូន",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            text: "ព័ត៍មានបានបញ្ជូនត្រឹមត្រូវ!",
            icon: "success",
            showConfirmButton: false,
            timer: 2200,
          });
          // remove(ref(db, `/SalaMOM/tools/timeTable/${selectTimeTableYear}/by_teacher/${selectTimeTable}/` + id));
          update(ref(db, `/SalaMOM/tools/timeTable/${upgradeYear}/`), mainTimeTable);
        }
      });
    }
    const deleteData = () => {
      Swal.fire({
        title: "តើអ្នកប្រាកដឬ?",
        showCancelButton: true,
        confirmButtonText: "លុប",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            text: "ព័ត៍មានបានលុបត្រឹមត្រូវ!",
            icon: "success",
            showConfirmButton: false,
            timer: 2200,
          });
          remove(ref(db, `/SalaMOM/tools/timeTable/${upgradeYear}/`));
          // update(ref(db, `/SalaMOM/tools/timeTable/${upgradeYear}/`), mainTimeTable);
        }
      });
    }
    return (
      <>
        <p style={{ fontWeight: 'bold', color: 'darkblue', textDecoration: 'underline' }}>Upgrade Data</p>
        <BtnYear />
        <button className="btn btn-warning text-center me-3" onClick={uploadData}>Upgrade</button>
        <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={deleteData}><CIcon style={{ color: 'red' }} icon={cilTrash} /></button>

      </>
    )
  }
  const GetDataYear = (e) => {
    const getKhYear = e.target.selectedOptions[0]
    setselectTimeTableYear(e.target.value)
    localStorage.setItem('outlineKhYear', getKhYear.dataset.khyear)
    window.location.reload()
  }
  const GetDataLevel = (e) => {
    setselectTimeTable(e.target.value)
    window.location.reload()
  }
  useEffect(() => {
    localStorage.setItem('New_Time_Table', selectTimeTable)
    setselectTimeTable(localStorage.getItem('New_Time_Table') || 'default')
  }, [selectTimeTable])
  useEffect(() => {
    localStorage.setItem('New_Time_Table_Year', selectTimeTableYear)
    setselectTimeTableYear(localStorage.getItem('New_Time_Table_Year') || 'default')
  }, [selectTimeTableYear])

  const LevelSelect = () => {
    return (
      <div>
        <select className="btn btn-primary btn-sm text-center me-3"
          value={selectTimeTable}
          onChange={GetDataLevel}
          style={{
            color: "white",
            lineHeight: "1",

          }}
          id="sle_level">
          <option value='កម្រិតថ្នាក់'>
            កម្រិតថ្នាក់
          </option>
          <option value='បឋមសិក្សា'>
            បឋមសិក្សា
          </option>
          <option value='អនុវិទ្យាល័យ'>
            អនុវិទ្យាល័យ
          </option>
          <option value='វិទ្យាល័យ'>
            វិទ្យាល័យ
          </option>
        </select>
      </div>
    );
  };
  const YearSelect = () => {
    return (
      <div>
        <select className="btn btn-primary btn-sm text-center me-3"
          value={selectTimeTableYear}
          onChange={GetDataYear}
          style={{
            color: "white",
            lineHeight: "1",

          }}
          id="sle_level">
          <option>ជ្រើសរើសឆ្នាំសិក្សា</option>
          {dataYear.map((d, index) => (
            <option value={d.yearEn} data-khyear={d.yearKh}>{d.yearKh}</option>
          ))}

        </select>
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-25 grid-margin">
        <div className="card card-primary card-outline">
          <div className="card-body">
            <div className="text-center">
              <div className="row">
                <h4 className="card-title">កាលវិភាគបង្រៀនកម្រិត <span>{selectTimeTable}</span></h4>

                <div className="d-flex justify-content-center">
                  <LevelSelect />
                  <YearSelect />
                  <PreviewPrimary />
                  <PreviewEnglish />
                  {/* <PreviewBtn /> */}
                  {/* <ControlUsers />
                  <ControlUsersEn />
                  <ControlBtn /> */}
                  <PutTitle />

                </div>
                <div>

                </div>
              </div>
            </div>
            <div className="m-3">
              <div className="content" id="time_tables">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card ">
                        <div className="table-fixed-top-left" id="show_mouse">
                          <table id="my_table">
                            <thead>
                              <tr>
                                <th rowSpan="3">ល.រ
                                </th>
                                <th rowSpan="3">
                                  ថ្នាក់</th>
                                <th rowSpan="3">
                                  បន្ទប់</th>
                                <td colSpan="8">
                                  ច័ន្ទ
                                </td>
                                <td colSpan="8">
                                  អង្គារ
                                </td>
                                <td colSpan="8">
                                  ពុធ
                                </td>
                                <td colSpan="8">
                                  ព្រហស្បតិ៍
                                </td>
                                <td colSpan="8">
                                  សុក្រ
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="4">
                                  ព្រឹក
                                </td>
                                <td colSpan="4">
                                  ល្ងាច
                                </td>
                                <td colSpan="4">
                                  ព្រឹក
                                </td>
                                <td colSpan="4">
                                  ល្ងាច
                                </td>
                                <td colSpan="4">
                                  ព្រឹក
                                </td>
                                <td colSpan="4">
                                  ល្ងាច
                                </td>
                                <td colSpan="4">
                                  ព្រឹក
                                </td>
                                <td colSpan="4">
                                  ល្ងាច
                                </td>
                                <td colSpan="4">
                                  ព្រឹក
                                </td>
                                <td colSpan="4">
                                  ល្ងាច
                                </td>

                              </tr>
                              <tr>
                                <td className="am">1
                                </td>
                                <td className="am">2
                                </td>
                                <td className="am">3
                                </td>
                                <td className="am">4
                                </td>
                                <td className="pm">1
                                </td>
                                <td className="pm">2
                                </td>
                                <td className="pm">3
                                </td>
                                <td className="pm">4
                                </td>
                                <td className="am">1
                                </td>
                                <td className="am">2
                                </td>
                                <td className="am">3
                                </td>
                                <td className="am">4
                                </td>
                                <td className="pm">1
                                </td>
                                <td className="pm">2
                                </td>
                                <td className="pm">3
                                </td>
                                <td className="pm">4
                                </td>
                                <td className="am">1
                                </td>
                                <td className="am">2
                                </td>
                                <td className="am">3
                                </td>
                                <td className="am">4
                                </td>
                                <td className="pm">1
                                </td>
                                <td className="pm">2
                                </td>
                                <td className="pm">3
                                </td>
                                <td className="pm">4
                                </td>
                                <td className="am">1
                                </td>
                                <td className="am">2
                                </td>
                                <td className="am">3
                                </td>
                                <td className="am">4
                                </td>
                                <td className="pm">1
                                </td>
                                <td className="pm">2
                                </td>
                                <td className="pm">3
                                </td>
                                <td className="pm">4
                                </td>
                                <td className="am">1
                                </td>
                                <td className="am">2
                                </td>
                                <td className="am">3
                                </td>
                                <td className="am">4
                                </td>
                                <td className="pm">1
                                </td>
                                <td className="pm">2
                                </td>
                                <td className="pm">3
                                </td>
                                <td className="pm">4
                                </td>

                              </tr>
                            </thead>
                            <tbody id="tbody_time_table">
                              <ShowData />
                            </tbody>
                          </table>

                          <div className="modal fade" id="exampleModal" tabindex="-1"
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true">
                            <div className="modal-dialog">
                              <div className="modal-content">

                                <div className="modal-body">
                                  <div className="input-group mb-3">
                                    <span className="input-group-text"
                                      id="basic-addon2">មុខវិជ្ជា</span>
                                    <select
                                      className="form-control text-center"
                                      aria-describedby="basic-addon2"
                                      style={{ color: "black", lineHeight: "2", height: "2.5rem" }}
                                      ref={set_user_sub}
                                      onChange={e => {
                                        const sbkh = e.target.selectedOptions[0].dataset.kh
                                        setsubjectChecks(sbkh)
                                      }}
                                      id="select_sub">
                                      <option>ជ្រើសរើសមុខវិជ្ជា
                                      </option>
                                      {dataSubject.map((d, index) => {

                                        return <option value={d.subAbr} data-kh={d.id}>{d.id}</option>
                                      }
                                      )}
                                    </select>

                                  </div>
                                  <p>
                                    <div className="input-group mb-3">
                                      <div className="dropdown"
                                        style={{ border: "1px solid #0000002d", backgroundColor: "rgba(88, 87, 87, 0.075)" }}>
                                        <button
                                          className="btn dropdown-toggle"
                                          type="button"
                                          id="dropdownMenuName"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false">
                                          ឈ្មោះបុគ្គលិក
                                        </button>
                                        <ul className="dropdown-menu menu-lg-scroll dropdown-content"
                                          aria-labelledby="dropdownMenuName"
                                          id="select_username">
                                          {dataStaff.map((d, index) => {
                                            const array1 = d.general_kindergaten.split(" ").filter(item => item);
                                            const array2 = d.general_primary.split(" ").filter(item => item);
                                            const array3 = d.general_secondary.split(" ").filter(item => item);
                                            {/* const stringArray = user_login_subs.split(" ").filter(item => item); */ }

                                            const combinedArray = array1.concat(array2, array3)
                                            if (combinedArray.includes(subjectChecks)) {
                                              return <li class="dropdown-item"
                                                data-label={d.id}
                                                data-t_grade={d.t_grade}
                                                data-teacher_type={d.teacher_type}
                                                data-image={d.get_url_pic}
                                                data-nickname={d.user_short_name}>
                                                <span className="me-3">{index + 1}.</span>
                                                {SetPicture(d)}
                                                {d.id}</li>

                                            }
                                          }
                                          )}
                                        </ul>
                                      </div>
                                      <input className="form-control"
                                        type="text"
                                        placeholder="ឈ្មោះបុគ្គលិក"
                                        onkeyup="this.value = this.value.toLowerCase()"
                                        id="user_teacher_id"
                                        ref={user_id}
                                        aria-describedby="dropdownMenuName" />
                                    </div>
                                    <input className="form-control"
                                      type="hidden"
                                      ref={user_img}
                                      id="user_url" />
                                    <input className="form-control"
                                      type="hidden"
                                      value={user_nick}
                                      onInput={e => { setuser_nick(e.target.value) }}
                                      id="user_nickname" />
                                    <input className="form-control"
                                      type="hidden"
                                      value={getT_grade}
                                      onChange={e => { setgetT_grade(e.target.value) }}
                                      id="user_t_grade" />
                                    <input className="form-control"
                                      type="hidden"
                                      value={getteacher_type}
                                      onChange={e => { setgetteacher_type(e.target.value) }}
                                      id="user_teacher_type" />

                                  </p>
                                  <div className="input-group mb-3">
                                    <span className="input-group-text"
                                      id="basic-addon2">កម្រិត</span>
                                    <select
                                      className="form-control text-center"
                                      aria-describedby="basic-addon2"
                                      style={{ color: "black", lineHeight: "2", height: "2.5rem" }}
                                      value={userType}
                                      onChange={e => { setuserType(e.target.value) }}
                                      id="select_sub">
                                      <option>ជ្រើសរើសកម្រិត
                                      </option>
                                      <option value={'yes'}>បឋមសិក្សា</option>
                                      <option value={'no'}>អនុវិទ្យាល័យ</option>
                                      <option value={'ok'}>វិទ្យាល័យ</option>
                                    </select>

                                  </div>


                                </div>
                                <div className="modal-footer">
                                  <div className="text-center" id="save_btn">

                                    <button type="button" id="btn_save"
                                      onClick={setTimeTable}
                                      class="btn btn-success btn-sm">បញ្ចូល</button>

                                    <button type="button" id="btn_update"
                                      onClick={updateTimeTable}
                                      class="btn btn-warning btn-sm">កែ</button>
                                    <button type="button" id="btn_del"
                                      onClick={removeTimeTable}
                                      class="btn btn-danger btn-sm">លុប</button>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>


                          <div id="subject-menu" className="popup">
                            <p>Select Subject:</p>
                            <select id="subject-select">
                              <option value="">-- Select Subject --</option>
                              <option value="M">Math</option>
                              <option value="K">Khmer</option>
                            </select>
                          </div>
                          <div id="teacher-menu" className="popup">
                            <p>Select Grade:</p>
                            <p id="close">Close</p>
                            <select id="teacher-select">
                              <option value="">-- Select Teacher --</option>
                              <option value="1A">1A</option>
                              <option value="2A">2A</option>
                              <option value="3A">3A</option>
                              <option value="4A">4A</option>
                              <option value="1B">1B</option>
                              <option value="2B">2B</option>
                              <option value="3B">3B</option>
                              <option value="4B">4B</option>
                            </select>
                            <button id="btn_submit">OK</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal fade" id="AddNewSub" tabindex="-1"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              className="col-sm-3 fw-bold fw-bold">មុខវិជ្ជាជាភាសារខ្មែរ</label>
                            <div className="col-sm-9">
                              <input
                                onChange={(e) => { setmyId(e.target.value) }}
                                ref={subInKh} type="text" className="form-control" id="subKh" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label
                              className="col-sm-3 fw-bold">មុខវិជ្ជាជាភាសារអង់គ្លេស</label>
                            <div className="col-sm-9">
                              <input ref={subInEn} type="text" className="form-control" id="subEn" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-sm-3 fw-bold">អក្សរកាត់</label>
                            <div className="col-sm-9">
                              <input ref={subInAbr} type="text" className="form-control" id="subAbr" />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="modal-footer">
                      <CButton
                        ref={BtnPush}
                        style={{ color: "white" }}
                        type="button" className="btn btn-success btn-sm">
                        <CIcon icon={cilArrowThickBottom} />   បញ្ចូល
                      </CButton>
                      <CButton
                        ref={BtnUpdate}
                        style={{ color: "white" }}
                        type="button" className="btn btn-warning btn-sm">
                        <CIcon icon={cilPen} />   កែ
                      </CButton>
                      <button
                        ref={BtnDelete}
                        style={{ color: 'white' }}
                        id="btn_upload" type="button" className="btn btn-danger btn-sm">
                        <CIcon icon={cilTrash} /></button>
                    </div>
                  </div>
                </div>
              </div>
              {/* For Preview Printing */}
              <div className="modal fade" id="forPreview" tabindex="-1" aria-labelledby="forPrinting" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="card-body">
                        <div className="table-responsive">
                          <div id="report-grade-time-table" className="report-container ">

                            <table className="table table-bordered grade-timetable" id="courseKh">
                              <tbody>
                                {/* <tr>
                                  <th scope="row" colSpan="8" className="text-center time-shit">
                                    ពេលព្រឹក</th>
                                </tr> */}

                                <tr className="time-header">
                                  <th scope="col" className="day"></th>
                                  <th scope="col" className="time-table-time-col time myKhmoul">ម៉ោង</th>
                                  <th scope="col" className="day myKhmoul">ច័ន្ទ</th>
                                  <th scope="col" className="day myKhmoul">អង្គារ</th>
                                  <th scope="col" className="day myKhmoul">ពុធ</th>
                                  <th scope="col" className="day myKhmoul">ព្រហស្បតិ៍</th>
                                  <th scope="col" className="day myKhmoul">សុក្រ</th>
                                </tr>

                                <tr >
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:15
                                  </th>
                                  <td
                                    style={{ fontWeight: 'bold' }}
                                    colSpan="7" className="text-center break-time myKhmoul">
                                    គោរពទង់ជាតិ
                                  </td>
                                </tr>

                                <tr id="time1">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t1_s"></span>
                                    <span className="merindiem1"></span> - <span id="t1_e"></span>
                                    <span className="merindiem2"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_mor_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_mor_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_mor_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_mor_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_mor_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_mor_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_mor_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_mor_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_mor_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_mor_t1" className="sb-color"></div>
                                  </td>
                                </tr>

                                <tr id="time2">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t2_s"></span>
                                    <span className="merindiem3"></span> - <span id="t2_e"></span>
                                    <span className="merindiem4"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_mor_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_mor_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_mor_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_mor_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_mor_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_mor_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_mor_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_mor_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_mor_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_mor_t2" className="sb-color"></div>
                                  </td>
                                </tr>

                                <tr id="break1">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:20
                                  </th>
                                  <th scope="row" className="time-table-time-col text-center textMiddle"><span
                                    id="b1_s"></span> <span className="merindiem5"></span> -
                                    <span id="b1_e"></span> <span className="merindiem6"></span>
                                  </th>
                                  <td
                                    style={{ fontWeight: 'bold' }}
                                    colSpan="7" className="text-center textMiddle break-time myKhmoul">

                                    <span id="k1" className="myKhmoul"></span> <span id="minu1" className="myKhmoul"></span> នាទី
                                  </td>
                                </tr>

                                <tr id="time3">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t3_s"></span>
                                    <span className="merindiem7"></span> - <span id="t3_e"></span>
                                    <span className="merindiem8"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_mor_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_mor_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_mor_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_mor_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_mor_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_mor_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_mor_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_mor_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_mor_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_mor_t3" className="sb-color"></div>
                                  </td>
                                </tr>

                                <tr id="time4">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t4_s"></span>
                                    <span className="merindiem9"></span> - <span id="t4_e"></span>
                                    <span className="merindiem10"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_mor_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_mor_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_mor_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_mor_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_mor_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_mor_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_mor_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_mor_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_mor_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_mor_t4" className="sb-color"></div>
                                  </td>
                                </tr>


                                <tr>
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    65mn
                                  </th>
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    11:15 - 12:20
                                  </th>
                                  <th scope="row" colSpan="8" className="text-center textMiddle time-shit myKhmoul">
                                    ញុាំបាយថ្ងៃត្រង់ និងសម្រាក</th>
                                </tr>

                                <tr className="time-header">
                                  <th scope="row" className="time-table-time-col text-center">
                                  </th>
                                  <th scope="col" className="time-table-time-col time myKhmoul">ម៉ោង</th>
                                  <th scope="col" className="day myKhmoul">ច័ន្ទ</th>
                                  <th scope="col" className="day myKhmoul">អង្គារ</th>
                                  <th scope="col" className="day myKhmoul">ពុធ</th>
                                  <th scope="col" className="day myKhmoul">ព្រហស្បតិ៍</th>
                                  <th scope="col" className="day myKhmoul">សុក្រ</th>
                                </tr>


                                <tr id="time5">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t5_s"></span>
                                    <span className="merindiem11"></span> - <span id="t5_e"></span>
                                    <span className="merindiem12"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_aft_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_aft_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_aft_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_aft_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_aft_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_aft_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_aft_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_aft_t1" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_aft_t1" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_aft_t1" className="sb-color"></div>
                                  </td>
                                </tr>

                                <tr id="time6">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t6_s"></span>
                                    <span className="merindiem13"></span> - <span id="t6_e"></span>
                                    <span className="merindiem14"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_aft_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_aft_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_aft_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_aft_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_aft_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_aft_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_aft_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_aft_t2" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_aft_t2" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_aft_t2" className="sb-color"></div>
                                  </td>
                                </tr>

                                <tr id="break2">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:15
                                  </th>
                                  <th scope="row" className="time-table-time-col text-center textMiddle"><span
                                    id="b2_s"></span> <span className="merindiem15"></span> -
                                    <span id="b2_e"></span> <span className="merindiem16"></span>
                                  </th>
                                  <td
                                    style={{ fontWeight: 'bold' }}
                                    colSpan="7" className="text-center textMiddle break-time myKhmoul">

                                    <span id="k2" className="myKhmoul"></span> <span id="minu2" className="myKhmoul"></span> នាទី
                                  </td>
                                </tr>

                                <tr id="time7">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t7_s"></span>
                                    <span className="merindiem17"></span> - <span id="t7_e"></span>
                                    <span className="merindiem18"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_aft_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_aft_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_aft_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_aft_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_aft_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_aft_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_aft_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_aft_t3" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_aft_t3" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_aft_t3" className="sb-color"></div>
                                  </td>
                                </tr>

                                <tr id="time8">
                                  <th scope="row" className="time-table-time-col text-center textMiddle">
                                    0:45
                                  </th>
                                  <th scope="row" className="text-center textMiddle"> <span id="t8_s"></span>
                                    <span className="merindiem19"></span> - <span id="t8_e"></span>
                                    <span className="merindiem20"></span>
                                  </th>
                                  <td className="text-center textMiddle">
                                    <div id="sb_mon_aft_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_mon_aft_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_tue_aft_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_tue_aft_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_wed_aft_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_wed_aft_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_thu_aft_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_thu_aft_t4" className="sb-color"></div>
                                  </td>
                                  <td className="text-center textMiddle">
                                    <div id="sb_fri_aft_t4" className="sub-color"></div>
                                    <br />
                                    <div id="tn_fri_aft_t4" className="sb-color"></div>
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row" colSpan="2" className="time-table-time-col text-center">

                                  </th>
                                  <th scope="row" colSpan="8" className="time-table-time-col text-center textMiddle myKhmoul">
                                    ◆ គ្រូបន្ទុកថ្នាក់ <b
                                      className="ml-1 homeroom-teacher-name myKhmoul">{getHeadTeacher}</b>
                                  </th>

                                </tr>
                                <tr>
                                  <th
                                    scope="row" colSpan="2" className="time-table-time-col text-center textMiddle">
                                    សំគាល់
                                  </th>
                                  <th
                                    scope="row" colSpan="4" className="time-table-time-col text-center">
                                    <table style={{
                                      borderCollapse: 'collapse',
                                    }}>
                                      <tbody className="mytr" style={{
                                        border: 'none',
                                      }} id="subjectCounts">
                                      </tbody>
                                    </table>
                                  </th>
                                  <th
                                    style={{
                                      lineHeight: '20px',
                                    }}
                                    scope="row" className="time-table-time-col text-center">
                                    សរុបម៉ោង
                                    <br />
                                    បង្រៀន
                                    <br />
                                    ក្នុងមួយសប្តាហ៍
                                    <br />
                                    <span style={{
                                      color: 'blue'
                                    }}>
                                      40 ម៉ោង
                                    </span>

                                  </th>

                                </tr>
                              </tbody>
                            </table>

                            <table className="w-100">
                              <tbody>
                                <tr style={{ verticalAlign: "top" }}>
                                  <td style={{ width: "65%" }}>
                                    <div className="mb-2">

                                      <div>

                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <input type="date" id="printingDate"></input>
                      <button
                        onClick={PrintKh}
                        type="button" className="btn btn-primary">Printing</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            {/* <div className="text-center">
              <PickupDateInput />
              <UpgradeCourse />

            </div> */}
          </div>
        </div>
      </div>
    </div>

  )
}

export default OfficeTimeTable
