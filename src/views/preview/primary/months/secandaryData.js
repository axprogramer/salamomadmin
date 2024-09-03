import React, { useEffect, useState, useRef } from "react";
import firebase from '../../../../components/firebaseConfig';
import { getDatabase, ref, set, update, remove, push, onValue } from "firebase/database";
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import Form from 'react-bootstrap/Form';
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowThickBottom, cilDataTransferDown, cilPen, cilPlus, cilPrint, cilSave, cilSearch, cilTrash, cilUser } from "@coreui/icons";
import { CButton, CModal, CModalBody, CModalFooter, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from "@coreui/react";
import { Container, Row, Col, FormControl } from 'react-bootstrap';
import { meta } from "eslint-plugin-prettier";


export default function OctoberData() {
  const db = getDatabase();

  const [dbLevel, setdbLevel] = useState(localStorage.getItem('dbLevelPreview') || 'default')
  const [dbGrade, setdbGrade] = useState(localStorage.getItem('dbGradePreview') || 'default')
  const [dbMonths, setdbMonths] = useState(localStorage.getItem('dbMonthsPreview') || 'default')
  const [dbYears, setdbYears] = useState(localStorage.getItem('dbYearsPreview') || 'default')
  const [dbDivi, setdbDivi] = useState(localStorage.getItem('dbDiviPreview') || 'default')
  const [dataStd, setdataStd] = useState([])
  const [dataAllGrades, setdataAllGrades] = useState([])
  const [dataAverage, setdataAverage] = useState([])
  const [getGrade, setgetGrade] = useState([])
  const [maleNum, setmaleNum] = useState(0)
  const [failNum, setfailNum] = useState(0)
  const [failMale, setfailMale] = useState(0)
  const [failFemale, setfailFemale] = useState(0)
  const [totalKh, settotalKh] = useState(0)
  const [femaleKh, setfemaleKh] = useState(0)
  const [passKh, setpassKh] = useState(0)
  const [passFemaleKh, setpassFemaleKh] = useState(0)
  const [failKh, setfailKh] = useState(0)
  const [failFemaleKh, setfailFemaleKh] = useState(0)
  const [saveDate, setsaveDate] = useState(localStorage.getItem('saveDate') || 'default')

  const [dbYearKh, setdbYearKh] = useState(localStorage.getItem('dbYearsKhPreview') || 'default')

  const [date, setDate] = useState(localStorage.getItem('saveDate') || 'default');
  const [month, setMonth] = useState(localStorage.getItem('saveMonth') || 'default');
  const [year, setYear] = useState(localStorage.getItem('saveYear') || 'default');
  const [valeDate, setvaleDate] = useState(localStorage.getItem('valeDate') || 'default');


  useEffect(() => {
    localStorage.setItem('dbLevelPreview', dbLevel);
    setdbLevel(localStorage.getItem('dbLevelPreview') || 'default')
  }, [dbLevel]);
  useEffect(() => {
    localStorage.setItem('dbGradePreview', dbGrade);
    setdbGrade(localStorage.getItem('dbGradePreview') || 'default')
  }, [dbGrade]);
  useEffect(() => {
    localStorage.setItem('dbMonthsPreview', dbMonths);
    setdbMonths(localStorage.getItem('dbMonthsPreview') || 'default')
  }, [dbMonths]);
  useEffect(() => {
    localStorage.setItem('dbYearsPreview', dbYears);
    setdbYears(localStorage.getItem('dbYearsPreview') || 'default')
  }, [dbYears]);
  useEffect(() => {
    localStorage.setItem('dbDiviPreview', dbDivi);
    setdbDivi(localStorage.getItem('dbDiviPreview') || 'default')
  }, [dbDivi]);
  useEffect(() => {
    localStorage.setItem('saveDate', date);
    setsaveDate(localStorage.getItem('saveDate') || 'default')
  }, [date]);
  useEffect(() => {
    localStorage.setItem('saveYear', year);
    setYear(localStorage.getItem('saveYear') || 'default')
  }, [year]);
  useEffect(() => {
    localStorage.setItem('saveMonth', month);
    setMonth(localStorage.getItem('saveMonth') || 'default')
  }, [month]);
  useEffect(() => {
    localStorage.setItem('valeDate', valeDate);
    setvaleDate(localStorage.getItem('valeDate') || 'default')
  }, [valeDate]);
  useEffect(() => {
    localStorage.setItem('dbYearsKhPreview', dbYearKh);
    setdbYearKh(localStorage.getItem('dbYearsKhPreview') || 'default')
  }, [dbYearKh]);

  //Array g1-3
  let primary_g_p1 = [
    '01A',
    '02A',
    '03A',
    '01B',
    '02B',
    '03B',
    '01C',
    '02C',
    '03C',
  ]
  //Array g4-6
  let primary_g_p2 = [
    '04A',
    '05A',
    '06A',
    '04B',
    '05B',
    '06B',
    '04C',
    '05C',
    '06C',
  ]

  //Conver array for different class
  function arrayClass(getClass) {
    const khmerDigits = {
      "1A": primary_g_p1,
      "2A": primary_g_p1,
      "3A": primary_g_p1,
      "1B": primary_g_p1,
      "2B": primary_g_p1,
      "3B": primary_g_p1,
      "1C": primary_g_p1,
      "2C": primary_g_p1,
      "3C": primary_g_p1,
      "4A": primary_g_p2,
      "5A": primary_g_p2,
      "6A": primary_g_p2,
      "4B": primary_g_p2,
      "5B": primary_g_p2,
      "6B": primary_g_p2,
      "4C": primary_g_p2,
      "5C": primary_g_p2,
      "6C": primary_g_p2,
    };

    if (getClass) {
      return khmerDigits[getClass]; // Use dictionary for single digits
    }
  }
  const classArray = arrayClass(dbGrade.replace(/^0/, ""))

  //Array months for showing data
  const monthsArr = [
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'AprilMay',
    'June',
    'July',
    'firstSemester',
    'secondSemester',
  ];

  //Get array months for database using
  function arrayMonths(getArMonths) {
    const khmerDigits = {
      October: "moct",
      November: "mnov",
      December: "mdec",
      January: "mjan",
      February: "mfeb",
      March: "mmarch",
      AprilMay: "mapma",
      June: "mjun",
      July: "mjul",
      firstSemester: "m1semester",
      secondSemester: "m2semester",
    };

    if (getArMonths) {
      return khmerDigits[getArMonths]; // Use dictionary for single digits
    }
  }
  const arrMonths = arrayMonths(dbMonths)

  //Save File to Excel
  const exportToExcel = (type, fn, dl) => {
    var elt = document.getElementById("showData");
    var wb = XLSX.utils.table_to_book(elt, { sheet: `${dbGrade}-${subMonth} ` });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(wb, fn || `លទ្ធផល/${dbGrade}/ ` + `${subMonth}.` + ("xlsx"));
  };

  //Print Preview Result
  function printPreview() {
    const printContent = document.getElementById('showData');
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
        <head>
        <title>លទ្ធផល-${dbGrade} ខែ${subMonth}</title>

        <style>
        .textCenter{
          text-align: start;
        }

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
            font-family: KhOSSiemreap;
            font-size: 0.8vw;

            }
            body {
                -webkit-print-color-adjust: exact; }
            table {
                width: 100%;
                border-collapse: collapse; }
            th, td {
                border: 1px solid black;
                color: black;
                text-align: center;
                padding:5px }
            #show_data_print td:nth-child(2){
                text-align: left;
                width: 10rem;
                padding: 5px;
            }
        </style>
        </head><body>`);
    newWindow.document.write(printContent.outerHTML);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => {
      newWindow.print();
    }, 500);
    // newWindow.close();

  }

  //Conver to Khmer number for all
  function gradeKH(number) {
    if (number < 0) {
      return "-" + gradeKH(Math.abs(number)); // Handle negative numbers
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

  function letterKH(number) {
    const khmerDigits = {
      A: "ក",
      B: "ខ",
      C: "គ",
      D: "ឃ",
      E: "ង",
    };

    if (number) {
      return khmerDigits[number]; // Use dictionary for single digits
    }
  }

  //Conver to Khmer months title
  function subMonths(months) {
    const khmerDigits = {
      October: "តុលា",
      November: "វិច្ឆិកា",
      December: "ធ្នូ",
      January: "មករា",
      February: "កុម្ភៈ",
      March: "មីនា",
      AprilMay: "មេសា-ឧសភា",
      June: "មិថុនា",
      July: "កក្កដា",
      firstSemester: "ឆមាសទី១",
      secondSemester: "ឆមាសទី២",
      firstSemesterResult: "ប្រចាំឆមាសទី១",
      secondSemesterResult: "ប្រចាំឆមាសទី២",
      fourmonths1: "ពិន្ទុ៤ខែឆមាសទី១",
      fourmonths2: "ពិន្ទុ៤ខែឆមាសទី២",
      AnnualYear: "ប្រចាំឆ្នាំ",
    };

    if (months) {
      return khmerDigits[months]; // Use dictionary for single digits
    }
  }

  function subMonthsPrint(months) {
    const khmerDigits = {
      October: "ចំណាត់ថ្នាក់ប្រចាំខែ តុលា",
      November: "ចំណាត់ថ្នាក់ប្រចាំខែ វិច្ឆិកា",
      December: "ចំណាត់ថ្នាក់ប្រចាំខែ ធ្នូ",
      January: "ចំណាត់ថ្នាក់ប្រចាំខែ មករា",
      February: "ចំណាត់ថ្នាក់ប្រចាំខែ កុម្ភៈ",
      March: "ចំណាត់ថ្នាក់ប្រចាំខែ មីនា",
      AprilMay: "ចំណាត់ថ្នាក់ប្រចាំខែ មេសា-ឧសភា",
      June: "ចំណាត់ថ្នាក់ប្រចាំខែ មិថុនា",
      July: "ចំណាត់ថ្នាក់ប្រចាំខែ កក្កដា",
      firstSemester: "ចំណាត់ថ្នាក់ប្រឡង ឆមាសទី១",
      secondSemester: "ចំណាត់ថ្នាក់ប្រឡង ឆមាសទី២",
      firstSemesterResult: "ចំណាត់ថ្នាក់ ប្រចាំឆមាសទី១",
      secondSemesterResult: "ចំណាត់ថ្នាក់ ប្រចាំឆមាសទី២",
      fourmonths1: "ចំណាត់ថ្នាក់ ពិន្ទុ៤ខែឆមាសទី១",
      fourmonths2: "ចំណាត់ថ្នាក់ ពិន្ទុ៤ខែឆមាសទី២",
      AnnualYear: "ចំណាត់ថ្នាក់ ប្រចាំឆ្នាំ",
    };

    if (months) {
      return khmerDigits[months]; // Use dictionary for single digits
    }
  }

  //Conver to Khmer number result
  const numericPart = parseInt(dbGrade);
  const alphabeticPart = dbGrade.replace(/\d+/g, '');
  let numKh = gradeKH(numericPart)
  let lettersKh = letterKH(alphabeticPart)
  let subMonth = subMonths(dbMonths)
  let subMonthPrinting = subMonthsPrint(dbMonths)

  //Database
  const dataAll = ref(db, `/SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}`);
  const dbAllGrade = ref(db, `/SalaMOM/tools/class/` + dbLevel);
  useEffect(() => {
    onValue(dataAll, (data) => {
      const dataSet = data.val();

      //Get Students numbers
      let num = 0; //Male Total
      let j = 0; //Total Fail std
      let k = 0;//Male fail
      let l = 0;//Female fail
      data.forEach(e => {
        let g = e.val().gender
        let h = e.val().average_moct
        let i = ''
        let n = ''
        if (h <= 4.9) {
          i = 'ធ្លាក់'
          n = `ធ្លាក់${g}`
        }
        let m = 'ប'
        let fa = 'ធ្លាក់'
        if (g === m) {
          num++
        }
        if (i === fa) {
          j++
        }
        if (n === 'ធ្លាក់ប') {
          k++
        }
        if (n === 'ធ្លាក់ស') {
          l++
        }
        setdataAverage(h)
      })
      setmaleNum(num)
      setfailNum(j)
      setfailMale(k)
      setfailFemale(l)

      setdataStd(dataSet ? Object.values(dataSet) : []); // Convert object to array

    })

    //Database Grades
    onValue(dbAllGrade, (data) => {
      const dataSet = data.val();
      data.forEach(e => {
        let en = e.val().clEn
        setgetGrade(en)
      })
      setdataAllGrades(dataSet ? Object.values(dataSet) : []); // Convert object to array
    })

  }, [])

  //Serach Data
  const SearchData = () => {
    setTimeout(() => {
      const searchInput = document.getElementById('inputsearchInput');
      const tbody1 = document.getElementById('showData');
      const tbody = tbody1.querySelector('tbody');
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        const matchingRows = Array.from(tbody.querySelectorAll("tr")).filter((row) => {
          return Array.from(row.querySelectorAll("td")).some((cell) => {
            return cell.textContent.toLowerCase().includes(searchTerm);
          });
        });

        for (const row of tbody.querySelectorAll("tr")) {
          row.classList.add("hidden"); // Hide all rows initially
        }

        for (const row of matchingRows) {
          row.classList.remove("hidden"); // Show only matching rows
        }
      });
    }, 1000);

    return (
      <>
        <div class="input-group">
          <div style={{ height: '2.4rem', marginBottom: '5px' }}
            class="input-group-prepend hover-cursor">
            <span class="input-group-text" id="search">
              <CIcon icon={cilSearch} />
            </span>
          </div>
          <input type="text" class="form-control" id="inputsearchInput"
            placeholder="ស្វែងរក" aria-label="search" aria-describedby="search" />
        </div>

      </>
    )
  }

  //Show pass and fail students
  const ShowPassFail = () => {
    const total_st = () => {
      const num = dataStd.length
      return num
    }
    function stKh(number) {
      if (number < 0) {
        return "-" + stKh(Math.abs(number)); // Handle negative numbers
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

    const st = total_st()
    let total_stKh = stKh(st);

    const total_female = () => {
      const st = dataStd.length
      let num = parseFloat(st) - parseFloat(maleNum)
      return num
    }
    const female = total_female()
    let total_femaleKh = stKh(female).toString().padStart(2, '០')

    const total_pass = () => {
      const st = dataStd.length
      let num = parseFloat(st) - parseFloat(failNum)
      return num
    }
    const pass = total_pass()
    let total_passKh = stKh(pass).toString().padStart(2, '០')

    const total_passFemale = () => {
      const st = dataStd.length
      let num = parseFloat(female) - parseFloat(failFemale)
      return num
    }
    const passFemale = total_passFemale()
    let total_passFemaleKh = stKh(passFemale).toString().padStart(2, '០')
    let total_failNumKh = stKh(failNum).toString().padStart(2, '០')
    let total_failFemaleKh = stKh(failFemale).toString().padStart(2, '០')
    settotalKh(total_stKh)
    setfemaleKh(total_femaleKh)
    setpassKh(total_passKh)
    setpassFemaleKh(total_passFemaleKh)
    setfailKh(total_failNumKh)
    setfailFemaleKh(total_failFemaleKh)
    return (
      <>
        <div style={{ overflowX: 'auto' }}>
          <table class="table table-borderless">
            <thead>
              <tr>
                <th>សិស្សសរុប៖ <strong id="st_all" style={{ color: 'blue' }}>{total_stKh}</strong>
                </th>
                <th>សិស្សស្រី៖ <strong id="st_female" style={{ color: 'blue' }}>{total_femaleKh}</strong>
                </th>
                <th>សិស្សជាប់៖ <strong id="st_pass"
                  style={{ color: 'green' }}>{total_passKh}</strong></th>
                <th>សិស្សស្រី៖ <strong id="st_pass_female"
                  style={{ color: 'green' }}>{total_passFemaleKh}</strong></th>
                <th>សិស្សធ្លាក់៖ <strong id="total_fail_st"
                  style={{ color: 'red' }}>{total_failNumKh}</strong></th>
                <th>សិស្សស្រី៖ <strong id="total_fail_female"
                  style={{ color: 'red' }}>{total_failFemaleKh}</strong></th>
              </tr>
            </thead>
          </table>
          <SearchData />
        </div>

      </>
    )
  }

  //Show data in tbody of main table preview
  const ShowAllData = () => {

    //Push student's rank for semester by subjects to database
    let student_rank = [];
    if (dbMonths === 'firstSemester') {
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.k_listen_moct - a.k_listen_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].k_listen_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.k_listen_moct === avg

          );
          for (let student of studentsWithRank) {
            student.k_listen_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.k_listen_moctRank
            if (!rank) {
              rank = '0.00'
            }
            let aar = {}
            aar[`k_listen_${arrMonths}Rank`] = rank

            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), aar);
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.k_speak_moct - a.k_speak_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].k_speak_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.k_speak_moct === avg

          );
          for (let student of studentsWithRank) {
            student.k_speak_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.k_speak_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                k_speak_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.k_reading_moct - a.k_reading_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].k_reading_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.k_reading_moct === avg

          );
          for (let student of studentsWithRank) {
            student.k_reading_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.k_reading_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                k_reading_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.k_dictation_moct - a.k_dictation_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].k_dictation_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.k_dictation_moct === avg

          );
          for (let student of studentsWithRank) {
            student.k_dictation_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.k_dictation_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                k_dictation_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.k_writing_moct - a.k_writing_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].k_writing_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.k_writing_moct === avg

          );
          for (let student of studentsWithRank) {
            student.k_writing_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.k_writing_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                k_writing_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.k_grammar_moct - a.k_grammar_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].k_grammar_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.k_grammar_moct === avg

          );
          for (let student of studentsWithRank) {
            student.k_grammar_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.k_grammar_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                k_grammar_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.k_homework_moct - a.k_homework_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].k_homework_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.k_homework_moct === avg

          );
          for (let student of studentsWithRank) {
            student.k_homework_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.k_homework_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                k_homework_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.math_speak_moct - a.math_speak_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].math_speak_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.math_speak_moct === avg

          );
          for (let student of studentsWithRank) {
            student.math_speak_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.math_speak_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                math_speak_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.math_moct - a.math_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].math_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.math_moct === avg

          );
          for (let student of studentsWithRank) {
            student.math_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.math_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                math_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.math_h_moct - a.math_h_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].math_h_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.math_h_moct === avg

          );
          for (let student of studentsWithRank) {
            student.math_h_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.math_h_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                math_h_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.sci_moct - a.sci_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].sci_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.sci_moct === avg

          );
          for (let student of studentsWithRank) {
            student.sci_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.sci_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                sci_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.sci_h_moct - a.sci_h_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].sci_h_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.sci_h_moct === avg

          );
          for (let student of studentsWithRank) {
            student.sci_h_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.sci_h_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                sci_h_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.soc_moct - a.soc_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].soc_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.soc_moct === avg

          );
          for (let student of studentsWithRank) {
            student.soc_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.soc_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                soc_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.soc_h_moct - a.soc_h_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].soc_h_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.soc_h_moct === avg

          );
          for (let student of studentsWithRank) {
            student.soc_h_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.soc_h_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                soc_h_moctRank: null,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.e_moct - a.e_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].e_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.e_moct === avg

          );
          for (let student of studentsWithRank) {
            student.e_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.e_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                e_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.e_h_moct - a.e_h_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].e_h_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.e_h_moct === avg

          );
          for (let student of studentsWithRank) {
            student.e_h_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.e_h_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                e_h_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.pe_moct - a.pe_moct });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].pe_moct;


          let studentsWithRank = student_rank.filter(
            (student) => student.pe_moct === avg

          );
          for (let student of studentsWithRank) {
            student.pe_moctRank = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.pe_moctRank
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                pe_moctRank: rank,
              });
            }
          })
        }

      }, [])
      useEffect(() => {
        student_rank.sort(function (a, b) { return b.st_average - a.st_average });
        for (let i = 0; i < student_rank.length; i++) {
          let avg = student_rank[i].st_average;


          let studentsWithRank = student_rank.filter(
            (student) => student.st_average === avg

          );
          for (let student of studentsWithRank) {
            student.rank_moct = i + 1;
          }
          i += studentsWithRank.length - 1;
        }
        {
          student_rank.map((d) => {
            var id = d.id
            var rank = d.rank_moct
            if (id) {
              update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), {
                rank_moct: rank,
              });
            }
          })
        }

      }, [])

    }


    return (
      <>
        {dataAllGrades.map((d) => {
          let data = d.clEn
          return (
            <>
              {/* Grade 1-3 */}
              {dbLevel === 'បឋមសិក្សា' &&
                data.includes(dbGrade) &&
                monthsArr.includes(dbMonths) &&
                primary_g_p1.includes(dbGrade) ? (
                <>
                  {dataStd.map((d, index) => {
                    var set = d
                    var id = d.id;
                    var fullname = d.fullname;
                    var user_grade = d.user_grade;
                    var gender = d.gender;
                    {/* var rank_moct = d.rank_moct;
                    var k_listen_moct = d.k_listen_moct;
                    var k_speak_moct = d.k_speak_moct;
                    var k_reading_moct = d.k_reading_moct;
                    var k_dictation_moct = d.k_dictation_moct;
                    var k_writing_moct = d.k_writing_moct;
                    var k_grammar_moct = d.k_grammar_moct;
                    var k_homework_moct = d.k_homework_moct; */}


                    {/* var math_speak_moct = d.math_speak_moct;
                    var math_moct = d.math_moct;
                    var math_h_moct = d.math_h_moct;

                    var sci_moct = d.sci_moct;
                    var sci_h_moct = d.sci_h_moct;

                    var soc_moct = d.soc_moct;
                    var soc_h_moct = d.soc_h_moct;

                    var e_moct = d.e_moct;
                    var e_h_moct = d.e_h_moct;
 */}
                    {/* var pe_moct = d.pe_moct; */ }
                    var average = d[`average_${arrMonths}`];
                    var rank_moct = d[`rank_${arrMonths}`];
                    var k_listen_moct = d[`k_listen_${arrMonths}`];
                    var k_speak_moct = d[`k_speak_${arrMonths}`];
                    var k_reading_moct = d[`k_reading_${arrMonths}`];
                    var k_dictation_moct = d[`k_dictation_${arrMonths}`];
                    var k_writing_moct = d[`k_writing_${arrMonths}`];
                    var k_grammar_moct = d[`k_grammar_${arrMonths}`];
                    var k_homework_moct = d[`k_homework_${arrMonths}`];
                    var math_speak_moct = d[`math_speak_${arrMonths}`];
                    var math_moct = d[`math_${arrMonths}`];
                    var math_h_moct = d[`math_h_${arrMonths}`];
                    var sci_moct = d[`sci_${arrMonths}`];
                    var sci_h_moct = d[`sci_h_${arrMonths}`];
                    var soc_moct = d[`soc_${arrMonths}`];
                    var soc_h_moct = d[`soc_h_${arrMonths}`];
                    var e_moct = d[`e_${arrMonths}`];
                    var e_h_moct = d[`e_h_${arrMonths}`];
                    var pe_moct = d[`pe_${arrMonths}`];

                    if (!k_listen_moct) { k_listen_moct = 0 };
                    if (!k_speak_moct) { k_speak_moct = 0 };
                    if (!k_reading_moct) { k_reading_moct = 0 };
                    if (!k_dictation_moct) { k_dictation_moct = 0 };
                    if (!k_writing_moct) { k_writing_moct = 0 };
                    if (!k_grammar_moct) { k_grammar_moct = 0 };
                    if (!k_homework_moct) { k_homework_moct = 0 };

                    if (!math_speak_moct) { math_speak_moct = 0 };
                    if (!math_moct) { math_moct = 0 };
                    if (!math_h_moct) { math_h_moct = 0 };

                    if (!sci_moct) { sci_moct = 0 };
                    if (!sci_h_moct) { sci_h_moct = 0 };

                    if (!soc_moct) { soc_moct = 0 };
                    if (!soc_h_moct) { soc_h_moct = 0 };

                    if (!e_moct) { e_moct = 0 };
                    if (!e_h_moct) { e_h_moct = 0 };

                    if (!pe_moct) { pe_moct = 0 };
                    if (!rank_moct) { rank_moct = 0 };

                    //Total all score
                    var total_all_score =
                      parseFloat(k_listen_moct) +
                      parseFloat(k_speak_moct) +
                      parseFloat(k_reading_moct) +
                      parseFloat(k_dictation_moct) +
                      parseFloat(k_writing_moct) +
                      parseFloat(k_homework_moct) +
                      parseFloat(math_speak_moct) +
                      parseFloat(math_moct) +
                      parseFloat(math_h_moct) +
                      parseFloat(sci_moct) +
                      parseFloat(sci_h_moct) +
                      parseFloat(soc_moct) +
                      parseFloat(soc_h_moct) +
                      parseFloat(e_moct) +
                      parseFloat(e_h_moct) +
                      parseFloat(pe_moct);
                    if (!total_all_score) { total_all_score = "00" }
                    //មធ្យមភាគ
                    var st_average =
                      parseFloat(total_all_score) / dbDivi;
                    st_average = st_average.toFixed(2);

                    student_rank.push({
                      id,
                      user_grade,
                      st_average,
                      total_all_score,
                      gender,
                      k_listen_moct,
                      k_speak_moct,
                      k_reading_moct,
                      k_dictation_moct,
                      k_writing_moct,
                      k_homework_moct,
                      math_speak_moct,
                      math_moct,
                      math_h_moct,
                      sci_moct,
                      sci_h_moct,
                      soc_moct,
                      soc_h_moct,
                      e_moct,
                      e_h_moct,
                      pe_moct,
                    })
                    let aar = {}
                    aar[`average_${arrMonths}`] = st_average
                    aar[`total_all_score_${arrMonths}`] = total_all_score

                    if (id) {
                      update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), aar);
                    }

                    //Mention average
                    let mention = '';
                    var my = parseFloat(average);
                    if (my <= 4.9) {
                      mention = "ខ្សោយ"
                    } else if (my <= 6.49) {
                      mention = "មធ្យម"
                    } else if (my <= 7.99) {
                      mention = "ល្អបង្គួរ";
                    } else if (my <= 9.49) {
                      mention = "ល្អ";
                    } else if (my <= 10) {
                      mention = "ល្អណាស់";
                    }
                    //Pass or Fail
                    let message = '';
                    var num = parseFloat(st_average)
                    if (num <= 4.9) {
                      message = 'ធ្លាក់'
                    } else if (num >= 5) {
                      message = 'ជាប់'
                    }
                    //Click cell to selected text
                    const clickText = (e) => {
                      var data = e.target
                      const range = document.createRange();
                      range.selectNodeContents(data);
                      const selection = window.getSelection();
                      selection.removeAllRanges();
                      selection.addRange(range);
                    }
                    //Key Enter/Arrow Up and down
                    const keyNext = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber);
                        const nextCell = document.querySelector(`[data-keynumber="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber);
                        const nextCell = document.querySelector(`[data-keynumber="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber);
                        const nextCell = document.querySelector(`[data-keynumber="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext2 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber2);
                        const nextCell = document.querySelector(`[data-keynumber2="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber2);
                        const nextCell = document.querySelector(`[data-keynumber2="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber2);
                        const nextCell = document.querySelector(`[data-keynumber2="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext3 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber3);
                        const nextCell = document.querySelector(`[data-keynumber3="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber3);
                        const nextCell = document.querySelector(`[data-keynumber3="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber3);
                        const nextCell = document.querySelector(`[data-keynumber3="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext4 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber4);
                        const nextCell = document.querySelector(`[data-keynumber4="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber4);
                        const nextCell = document.querySelector(`[data-keynumber4="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber4);
                        const nextCell = document.querySelector(`[data-keynumber4="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext5 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber5);
                        const nextCell = document.querySelector(`[data-keynumber5="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber5);
                        const nextCell = document.querySelector(`[data-keynumber5="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber5);
                        const nextCell = document.querySelector(`[data-keynumber5="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext6 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber6);
                        const nextCell = document.querySelector(`[data-keynumber6="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber6);
                        const nextCell = document.querySelector(`[data-keynumber6="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber6);
                        const nextCell = document.querySelector(`[data-keynumber6="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext7 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber7);
                        const nextCell = document.querySelector(`[data-keynumber7="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber7);
                        const nextCell = document.querySelector(`[data-keynumber7="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber7);
                        const nextCell = document.querySelector(`[data-keynumber7="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext8 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber8);
                        const nextCell = document.querySelector(`[data-keynumber8="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber8);
                        const nextCell = document.querySelector(`[data-keynumber8="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber8);
                        const nextCell = document.querySelector(`[data-keynumber8="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext9 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber9);
                        const nextCell = document.querySelector(`[data-keynumber9="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber9);
                        const nextCell = document.querySelector(`[data-keynumber9="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber9);
                        const nextCell = document.querySelector(`[data-keynumber9="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext10 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber10);
                        const nextCell = document.querySelector(`[data-keynumber10="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber10);
                        const nextCell = document.querySelector(`[data-keynumber10="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber10);
                        const nextCell = document.querySelector(`[data-keynumber10="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext11 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber11);
                        const nextCell = document.querySelector(`[data-keynumber11="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber11);
                        const nextCell = document.querySelector(`[data-keynumber11="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber11);
                        const nextCell = document.querySelector(`[data-keynumber11="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext12 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber12);
                        const nextCell = document.querySelector(`[data-keynumber12="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber12);
                        const nextCell = document.querySelector(`[data-keynumber12="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber12);
                        const nextCell = document.querySelector(`[data-keynumber12="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext13 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber13);
                        const nextCell = document.querySelector(`[data-keynumber13="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber13);
                        const nextCell = document.querySelector(`[data-keynumber13="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber13);
                        const nextCell = document.querySelector(`[data-keynumber13="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext14 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber14);
                        const nextCell = document.querySelector(`[data-keynumber14="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber14);
                        const nextCell = document.querySelector(`[data-keynumber14="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber14);
                        const nextCell = document.querySelector(`[data-keynumber14="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext15 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber15);
                        const nextCell = document.querySelector(`[data-keynumber15="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber15);
                        const nextCell = document.querySelector(`[data-keynumber15="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber15);
                        const nextCell = document.querySelector(`[data-keynumber15="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext16 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber16);
                        const nextCell = document.querySelector(`[data-keynumber16="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber16);
                        const nextCell = document.querySelector(`[data-keynumber16="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber16);
                        const nextCell = document.querySelector(`[data-keynumber16="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext17 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber17);
                        const nextCell = document.querySelector(`[data-keynumber17="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber17);
                        const nextCell = document.querySelector(`[data-keynumber17="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber17);
                        const nextCell = document.querySelector(`[data-keynumber17="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    return (
                      <>
                        <tr key={d.id}>
                          <td>{index + 1}</td>
                          <td className="text-start textStart">{fullname}</td>
                          <td>{gender}</td>
                          <td
                            data-keynumber={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_listen_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext}
                            dangerouslySetInnerHTML={{ __html: k_listen_moct }}
                          ></td>
                          <td
                            data-keynumber2={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_speak_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext2}
                            dangerouslySetInnerHTML={{ __html: k_speak_moct }}
                          ></td>
                          <td
                            data-keynumber3={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_reading_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext3}
                            dangerouslySetInnerHTML={{ __html: k_reading_moct }}
                          ></td>
                          <td
                            data-keynumber4={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_dictation_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext4}
                            dangerouslySetInnerHTML={{ __html: k_dictation_moct }}
                          ></td>
                          <td
                            data-keynumber5={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_writing_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext5}
                            dangerouslySetInnerHTML={{ __html: k_writing_moct }}
                          ></td>
                          <td
                            data-keynumber6={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`math_speak_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext6}
                            dangerouslySetInnerHTML={{ __html: math_speak_moct }}
                          ></td>
                          <td
                            data-keynumber7={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`math_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext7}
                            dangerouslySetInnerHTML={{ __html: math_moct }}
                          ></td>
                          <td
                            data-keynumber8={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`math_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext8}
                            dangerouslySetInnerHTML={{ __html: math_h_moct }}
                          ></td>
                          <td
                            data-keynumber9={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`sci_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext9}
                            dangerouslySetInnerHTML={{ __html: sci_moct }}
                          ></td>
                          <td
                            data-keynumber10={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`soc_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext10}
                            dangerouslySetInnerHTML={{ __html: soc_moct }}
                          ></td>
                          <td
                            data-keynumber11={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_homework_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext11}
                            dangerouslySetInnerHTML={{ __html: k_homework_moct }}
                          ></td>
                          <td
                            data-keynumber12={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`sci_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext12}
                            dangerouslySetInnerHTML={{ __html: sci_h_moct }}
                          ></td>
                          <td
                            data-keynumber13={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`soc_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext13}
                            dangerouslySetInnerHTML={{ __html: soc_h_moct }}
                          ></td>
                          <td
                            data-keynumber14={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`e_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext14}
                            dangerouslySetInnerHTML={{ __html: e_h_moct }}
                          ></td>
                          <td
                            data-keynumber15={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`pe_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext15}
                            dangerouslySetInnerHTML={{ __html: pe_moct }}
                          ></td>
                          <td
                            data-keynumber16={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`e_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext16}
                            dangerouslySetInnerHTML={{ __html: e_moct }}
                          ></td>
                          <td
                            dangerouslySetInnerHTML={{ __html: total_all_score }}
                          ></td>
                          <td
                            dangerouslySetInnerHTML={{ __html: st_average }}
                          ></td>
                          <td style={{ color: 'red' }}
                            dangerouslySetInnerHTML={{ __html: mention }}
                          ></td>
                          <td style={{ color: 'blue' }}
                            dangerouslySetInnerHTML={{ __html: message }}
                          ></td>
                        </tr>
                      </>
                    )
                  })}
                </>
              ) : (
                <>
                  {/* <h1>No Data</h1> */}
                </>
              )
              }
              {/* Grade 4-6 */}
              {dbLevel === 'បឋមសិក្សា' &&
                data.includes(dbGrade) &&
                monthsArr.includes(dbMonths) &&
                primary_g_p2.includes(dbGrade) ? (
                <>
                  {dataStd.map((d, index) => {
                    var set = d
                    var id = d.id;
                    var fullname = d.fullname;
                    var user_grade = d.user_grade;
                    var gender = d.gender;
                    var average = d[`average_${arrMonths}`];
                    var rank_moct = d[`rank_${arrMonths}`];

                    var k_reading_moct = d[`k_reading_${arrMonths}`];
                    var k_dictation_moct = d[`k_dictation_${arrMonths}`];
                    var k_writing_moct = d[`k_writing_${arrMonths}`];
                    var k_grammar_moct = d[`k_grammar_${arrMonths}`];
                    var k_homework_moct = d[`k_homework_${arrMonths}`];
                    var math_speak_moct = d[`math_speak_${arrMonths}`];
                    var math_moct = d[`math_${arrMonths}`];
                    var math_h_moct = d[`math_h_${arrMonths}`];
                    var sci_moct = d[`sci_${arrMonths}`];
                    var sci_h_moct = d[`sci_h_${arrMonths}`];

                    var soc_h_moct = d[`soc_h_${arrMonths}`];
                    var e_moct = d[`e_${arrMonths}`];
                    var e_h_moct = d[`e_h_${arrMonths}`];
                    var pe_moct = d[`pe_${arrMonths}`];
                    var geor_moct = d[`geor_${arrMonths}`];
                    var hist_moct = d[`hist_${arrMonths}`];
                    var moral_moct = d[`moral_${arrMonths}`];


                    if (!k_reading_moct) { k_reading_moct = 0 };
                    if (!k_dictation_moct) { k_dictation_moct = 0 };
                    if (!k_writing_moct) { k_writing_moct = 0 };
                    if (!k_grammar_moct) { k_grammar_moct = 0 };
                    if (!k_homework_moct) { k_homework_moct = 0 };

                    if (!math_speak_moct) { math_speak_moct = 0 };
                    if (!math_moct) { math_moct = 0 };
                    if (!math_h_moct) { math_h_moct = 0 };

                    if (!sci_moct) { sci_moct = 0 };
                    if (!sci_h_moct) { sci_h_moct = 0 };

                    if (!soc_h_moct) { soc_h_moct = 0 };

                    if (!e_moct) { e_moct = 0 };
                    if (!e_h_moct) { e_h_moct = 0 };

                    if (!pe_moct) { pe_moct = 0 };
                    if (!rank_moct) { rank_moct = 0 };
                    if (!geor_moct) { geor_moct = 0 };
                    if (!hist_moct) { hist_moct = 0 };
                    if (!moral_moct) { moral_moct = 0 };

                    //Total all score
                    var total_all_score =
                      parseFloat(geor_moct) +
                      parseFloat(hist_moct) +
                      parseFloat(moral_moct) +
                      parseFloat(k_reading_moct) +
                      parseFloat(k_dictation_moct) +
                      parseFloat(k_writing_moct) +
                      parseFloat(k_homework_moct) +
                      parseFloat(math_speak_moct) +
                      parseFloat(math_moct) +
                      parseFloat(math_h_moct) +
                      parseFloat(sci_moct) +
                      parseFloat(sci_h_moct) +
                      parseFloat(soc_h_moct) +
                      parseFloat(e_moct) +
                      parseFloat(e_h_moct) +
                      parseFloat(pe_moct);
                    if (!total_all_score) { total_all_score = "00" }
                    //មធ្យមភាគ
                    var st_average =
                      parseFloat(total_all_score) / dbDivi;
                    st_average = st_average.toFixed(2);

                    student_rank.push({
                      id,
                      user_grade,
                      st_average,
                      total_all_score,
                      gender,
                      geor_moct,
                      hist_moct,
                      k_reading_moct,
                      k_dictation_moct,
                      k_writing_moct,
                      k_homework_moct,
                      math_speak_moct,
                      math_moct,
                      math_h_moct,
                      sci_moct,
                      sci_h_moct,
                      moral_moct,
                      soc_h_moct,
                      e_moct,
                      e_h_moct,
                      pe_moct,
                    })
                    let aar = {}
                    aar[`average_${arrMonths}`] = st_average
                    aar[`total_all_score_${arrMonths}`] = total_all_score

                    if (id) {
                      update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + id), aar);
                    }

                    //Mention average
                    let mention = '';
                    var my = parseFloat(average);
                    if (my <= 4.9) {
                      mention = "ខ្សោយ"
                    } else if (my <= 6.49) {
                      mention = "មធ្យម"
                    } else if (my <= 7.99) {
                      mention = "ល្អបង្គួរ";
                    } else if (my <= 9.49) {
                      mention = "ល្អ";
                    } else if (my <= 10) {
                      mention = "ល្អណាស់";
                    }
                    //Pass or Fail
                    let message = '';
                    var num = parseFloat(st_average)
                    if (num <= 4.9) {
                      message = 'ធ្លាក់'
                    } else if (num >= 5) {
                      message = 'ជាប់'
                    }
                    //Click cell to selected text
                    const clickText = (e) => {
                      var data = e.target
                      const range = document.createRange();
                      range.selectNodeContents(data);
                      const selection = window.getSelection();
                      selection.removeAllRanges();
                      selection.addRange(range);
                    }
                    //Key Enter/Arrow Up and down
                    const keyNext = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber);
                        const nextCell = document.querySelector(`[data-keynumber="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber);
                        const nextCell = document.querySelector(`[data-keynumber="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber);
                        const nextCell = document.querySelector(`[data-keynumber="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext2 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber2);
                        const nextCell = document.querySelector(`[data-keynumber2="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber2);
                        const nextCell = document.querySelector(`[data-keynumber2="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber2);
                        const nextCell = document.querySelector(`[data-keynumber2="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext3 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber3);
                        const nextCell = document.querySelector(`[data-keynumber3="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber3);
                        const nextCell = document.querySelector(`[data-keynumber3="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber3);
                        const nextCell = document.querySelector(`[data-keynumber3="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext4 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber4);
                        const nextCell = document.querySelector(`[data-keynumber4="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber4);
                        const nextCell = document.querySelector(`[data-keynumber4="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber4);
                        const nextCell = document.querySelector(`[data-keynumber4="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext5 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber5);
                        const nextCell = document.querySelector(`[data-keynumber5="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber5);
                        const nextCell = document.querySelector(`[data-keynumber5="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber5);
                        const nextCell = document.querySelector(`[data-keynumber5="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext6 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber6);
                        const nextCell = document.querySelector(`[data-keynumber6="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber6);
                        const nextCell = document.querySelector(`[data-keynumber6="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber6);
                        const nextCell = document.querySelector(`[data-keynumber6="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext7 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber7);
                        const nextCell = document.querySelector(`[data-keynumber7="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber7);
                        const nextCell = document.querySelector(`[data-keynumber7="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber7);
                        const nextCell = document.querySelector(`[data-keynumber7="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext8 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber8);
                        const nextCell = document.querySelector(`[data-keynumber8="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber8);
                        const nextCell = document.querySelector(`[data-keynumber8="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber8);
                        const nextCell = document.querySelector(`[data-keynumber8="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext9 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber9);
                        const nextCell = document.querySelector(`[data-keynumber9="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber9);
                        const nextCell = document.querySelector(`[data-keynumber9="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber9);
                        const nextCell = document.querySelector(`[data-keynumber9="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext10 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber10);
                        const nextCell = document.querySelector(`[data-keynumber10="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber10);
                        const nextCell = document.querySelector(`[data-keynumber10="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber10);
                        const nextCell = document.querySelector(`[data-keynumber10="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext11 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber11);
                        const nextCell = document.querySelector(`[data-keynumber11="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber11);
                        const nextCell = document.querySelector(`[data-keynumber11="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber11);
                        const nextCell = document.querySelector(`[data-keynumber11="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext12 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber12);
                        const nextCell = document.querySelector(`[data-keynumber12="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber12);
                        const nextCell = document.querySelector(`[data-keynumber12="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber12);
                        const nextCell = document.querySelector(`[data-keynumber12="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext13 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber13);
                        const nextCell = document.querySelector(`[data-keynumber13="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber13);
                        const nextCell = document.querySelector(`[data-keynumber13="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber13);
                        const nextCell = document.querySelector(`[data-keynumber13="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext14 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber14);
                        const nextCell = document.querySelector(`[data-keynumber14="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber14);
                        const nextCell = document.querySelector(`[data-keynumber14="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber14);
                        const nextCell = document.querySelector(`[data-keynumber14="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext15 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber15);
                        const nextCell = document.querySelector(`[data-keynumber15="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber15);
                        const nextCell = document.querySelector(`[data-keynumber15="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber15);
                        const nextCell = document.querySelector(`[data-keynumber15="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext16 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber16);
                        const nextCell = document.querySelector(`[data-keynumber16="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber16);
                        const nextCell = document.querySelector(`[data-keynumber16="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber16);
                        const nextCell = document.querySelector(`[data-keynumber16="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    const keyNext17 = (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber17);
                        const nextCell = document.querySelector(`[data-keynumber17="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber17);
                        const nextCell = document.querySelector(`[data-keynumber17="${currentIndex + 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const currentCell = event.target;
                        const currentIndex = parseInt(currentCell.dataset.keynumber17);
                        const nextCell = document.querySelector(`[data-keynumber17="${currentIndex - 1}"]`);
                        if (nextCell) {
                          const range = document.createRange();
                          range.selectNodeContents(nextCell);
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        if (nextCell) {
                          nextCell.focus();
                        }
                      }
                    }
                    return (
                      <>
                        <tr key={d.id}>
                          <td>{index + 1}</td>
                          <td className="text-start textStart">{fullname}</td>
                          <td>{gender}</td>
                          <td
                            data-keynumber={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_reading_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext}
                            dangerouslySetInnerHTML={{ __html: k_reading_moct }}
                          ></td>
                          <td
                            data-keynumber2={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_dictation_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext2}
                            dangerouslySetInnerHTML={{ __html: k_dictation_moct }}
                          ></td>
                          <td
                            data-keynumber4={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_writing_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext4}
                            dangerouslySetInnerHTML={{ __html: k_writing_moct }}
                          ></td>
                          <td
                            data-keynumber5={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_grammar_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext5}
                            dangerouslySetInnerHTML={{ __html: k_grammar_moct }}
                          ></td>
                          <td
                            data-keynumber6={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`math_speak_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext6}
                            dangerouslySetInnerHTML={{ __html: math_speak_moct }}
                          ></td>
                          <td
                            data-keynumber7={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`math_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext7}
                            dangerouslySetInnerHTML={{ __html: math_moct }}
                          ></td>
                          <td
                            data-keynumber8={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`math_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext8}
                            dangerouslySetInnerHTML={{ __html: math_h_moct }}
                          ></td>
                          <td
                            data-keynumber9={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`sci_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext9}
                            dangerouslySetInnerHTML={{ __html: sci_moct }}
                          ></td>
                          <td
                            data-keynumber10={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`geor_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext10}
                            dangerouslySetInnerHTML={{ __html: geor_moct }}
                          ></td>
                          <td
                            data-keynumber11={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`hist_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext11}
                            dangerouslySetInnerHTML={{ __html: hist_moct }}
                          ></td>
                          <td
                            data-keynumber12={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`moral_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext12}
                            dangerouslySetInnerHTML={{ __html: moral_moct }}
                          ></td>
                          <td
                            data-keynumber13={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`k_homework_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext13}
                            dangerouslySetInnerHTML={{ __html: k_homework_moct }}
                          ></td>
                          <td
                            data-keynumber14={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`sci_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext14}
                            dangerouslySetInnerHTML={{ __html: sci_h_moct }}
                          ></td>
                          <td
                            data-keynumber15={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`soc_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext15}
                            dangerouslySetInnerHTML={{ __html: soc_h_moct }}
                          ></td>
                          <td
                            data-keynumber16={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`e_h_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext16}
                            dangerouslySetInnerHTML={{ __html: e_h_moct }}
                          ></td>
                          <td
                            data-keynumber16={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`pe_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext16}
                            dangerouslySetInnerHTML={{ __html: pe_moct }}
                          ></td>
                          <td
                            data-keynumber16={index + 1}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const setID = d.id
                              const data = e.target.innerHTML
                              let aar = {}
                              aar[`e_${arrMonths}`] = data
                              if (setID) {
                                update(ref(db, `SalaMOM/classes/` + `${dbYears}/` + `${dbGrade.replace(/^0+/, '')}/` + setID), aar);
                              }
                            }}
                            onClick={clickText}
                            // onKeyDown={keyNext16}
                            dangerouslySetInnerHTML={{ __html: e_moct }}
                          ></td>
                          <td
                            dangerouslySetInnerHTML={{ __html: total_all_score }}
                          ></td>
                          <td
                            dangerouslySetInnerHTML={{ __html: st_average }}
                          ></td>
                          <td style={{ color: 'red' }}
                            dangerouslySetInnerHTML={{ __html: mention }}
                          ></td>
                          <td style={{ color: 'blue' }}
                            dangerouslySetInnerHTML={{ __html: message }}
                          ></td>
                        </tr>
                      </>
                    )
                  })}
                </>
              ) : (
                <>
                  {/* <h1>No Data</h1> */}
                </>
              )
              }
            </>
          )

        })}
      </>
    )
  }
  //Print Result
  const HeaderPrintResult = () => {

    return (
      <>
        <th className="border-dark">ល.រ</th>
        <th className="border-dark" style={{ width: '15vh' }}>គោត្តនាម-នាម</th>
        <th className="border-dark">ភេទ</th>
        <th className="border-dark">ពិន្ទុសរុប</th>
        <th className="border-dark">មធ្យមភាគ</th>
        <th className="border-dark" style={{ width: '8vh' }}>ចំណាត់ថ្នាក់</th>
        <th className="border-dark">និទ្ទេស</th>
        <th className="border-dark">ផ្សេងៗ</th>
      </>
    )
  }

  const ViewPrint = () => {
    const dbPreview = [...dataStd].sort((a, b) => b.average_moct.localeCompare(a.average_moct));

    return (
      <>
        <div id="print_result_all">
          <table className="table table-bordered border-dark">
            <thead
              style={{
                fontSize: '1.5vw',
                lineHeight: '1.5'
              }}

            >
              <tr>
                <HeaderPrintResult />
              </tr>
            </thead>
            <tbody
              style={{
                fontSize: '1.5vw',
                lineHeight: '1.5',
                padding: '10px'
              }}
            >

              {dbPreview.map((d, index) => {
                var average = d.average_moct;
                var average = d.average_moct;
                let mention = '';
                var my = parseFloat(average);
                if (my <= 4.9) {
                  mention = "ខ្សោយ"
                } else if (my <= 6.49) {
                  mention = "មធ្យម"
                } else if (my <= 7.99) {
                  mention = "ល្អបង្គួរ";
                } else if (my <= 9.49) {
                  mention = "ល្អ";
                } else if (my <= 10) {
                  mention = "ល្អណាស់";
                }
                return (
                  <>
                    <tr key={d.id}>
                      <td className="border-dark">{index + 1}</td>
                      <td className="border-dark text-start">{d.fullname}</td>
                      <td className="border-dark">{d.gender}</td>
                      <td className="border-dark">{d.total_all_score_moct}</td>
                      <td className="border-dark">{d.average_moct}</td>
                      <td className="border-dark" style={{ color: 'red' }}>{d.rank_moct}</td>
                      <td className="border-dark" style={{ color: 'red' }}>{mention}</td>
                      <td className="border-dark"></td>
                    </tr>
                  </>
                )
              })}
            </tbody>

          </table>
          <Col
            className="mt-2"
            style={{
              fontSize: '1.5vw',
              lineHeight: '1.5',
            }}
          >
            <Row style={{ marginRight: '4vh' }}>
              <Col className="text-end fw-bold">
                - បញ្ឈប់បញ្ចីត្រឹមចំនួន
                <span id="total_pass_all" style={{ color: 'blue' }}>{totalKh}</span>
                នាក់ ស្រី <span id="total_female"
                  style={{ color: 'blue' }}>{femaleKh}</span> នាក់
              </Col>
            </Row>
            <Row style={{ marginRight: '4vh' }}>
              <Col className="text-end fw-bold">
                - សិស្សជាប់មធ្យមភាគ <span
                  id="total_pass_st" style={{ color: 'blue' }}>{passKh}</span> នាក់
                ស្រី <span id="total_pass_female"
                  style={{ color: 'blue' }}>{passFemaleKh}</span> នាក់              </Col>
            </Row>
            <Row style={{ marginRight: '4vh' }}>
              <Col className="text-end fw-bold">
                - សិស្សធ្លាក់មធ្យមភាគ
                <span id="total_fail_std" style={{ color: 'blue' }}>{failKh}</span>
                នាក់ ស្រី <span id="total_fail_female_st"
                  style={{ color: 'blue' }}>{failFemaleKh}</span> នាក់
              </Col>
            </Row>
            <Row style={{ marginRight: '3vh' }}>
              <Col>
                <div
                  style={{
                    position: 'relative',

                  }}>
                  <div
                    style={{
                      position: 'relative',
                      display: 'block',
                      width: '10vw',
                      height: 'auto'
                    }}
                  >
                    <img
                      style={{
                        position: 'relative',
                        display: 'block',
                        width: '30vw',
                        left: '100%',
                        height: 'auto'
                      }}
                      src="https://res.cloudinary.com/salamomschool/image/upload/v1720781504/principleSign2.png" />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      marginTop: '1.8vw',
                      top: '10%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      padding: '10px 20px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    <p>បានឃើញ និងឯកភាព</p>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      marginTop: '1.8vw',
                      top: '25%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      padding: '10px 20px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    <p>នាយិកាសាលា</p>
                  </div>
                </div>

              </Col>

              <Col className="text-end fw-bold mt-2">
                រាជធានីភ្នំពេញ, ថ្ងៃទី
                <span id="get_date_num" style={{ color: 'blue' }}> {date} </span>
                ខែ<span id="get_month" style={{ color: 'blue' }}> {month} </span>
                ឆ្នាំ <span id="get_year" style={{ color: 'blue' }}> {year} </span>
                <div
                  style={{ marginRight: '5vh' }}
                  className="mt-2">
                  <spa>គ្រូទទួលបន្ទុកថ្នាក់</spa>
                </div>
              </Col>
            </Row>

          </Col>
        </div>

      </>
    )
  }
  const ControlerContent = () => {
    const printDiv = () => {
      const printContent = document.getElementById('print_result_all');
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>លទ្ធផល-${numKh}(${lettersKh}) ${subMonth}</title>
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
                transform-origin: 0 0;
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
        td {
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
            font-size: 1.5vw;
            line-height: 1;
            padding: 20dvh;
        }
        {
            font-size: 1.5vw;
            line-height: 1;
            padding: 20dvh;
        }
        .container-principal-sign {
        position: relative;
          top: -15%;

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
          top: 0%;
          margin-top: 1.8vw;
          left: 50%;
          font-weight: bold;
          transform: translate(-50%, -50%); /* Centers the text within the image */
          padding: 10px 20px;
          text-align: center;
        }
        .headSize{
          font-size: 1.5vw;
          line-height: 1.5
        }
        .line_limit{
            width: 28vh;
        }
        .line_limit2{
            width: 20vh;
        }
            }
        </style>
        </head>
        <body>
            <div>
        <table class="table table-borderless head_table headSize">
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
                    <th class="text-start">សាលាបឋមសិក្សា៖ មុំ</th>
                    <th class="line_limit2">${subMonthPrinting}</th>
                    <th></th>
                </tr>
                <tr>
                    <th class="text-start">ថ្នាក់ទី ${numKh} (${lettersKh})</th>
                    <th>ឆ្នាំសិក្សា ${dbYearKh}</th>
                </tr>
            </thead>
            </table>
        </div>

        `);
      newWindow.document.write(printContent.outerHTML);
      newWindow.document.write('</body></html>');
      newWindow.document.close();
      newWindow.focus();
      setTimeout(() => {
        newWindow.print();
      }, 1000);

    }
    function dateKh(number) {
      if (number < 0) {
        return "-" + dateKh(Math.abs(number)); // Handle negative numbers
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

    const inputDate = (event) => {
      const selectedDate = new Date(event.target.value);
      let date = new Date(selectedDate);
      let year = date.getFullYear();
      let day = date.getDate();
      let month = date.getMonth();
      let month2 = date.getMonth();

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

      const yearKh = convertYear(year).toString().padStart(2, '០')
      const dayKh = dateKh(day).toString().padStart(2, '០')
      if (date) {
        localStorage.setItem('saveDate', dayKh)
        localStorage.setItem('saveMonth', month)
        localStorage.setItem('saveYear', yearKh)
        localStorage.setItem('valeDate', `${year}/${day}/${month2}`)
      }
      setMonth(month)
      setDate(dayKh)
      setYear(yearKh)
    }
    return (
      <>
        <Col>
          <Row>
            <Col>
              <div>
                <button type="button" id="btnSave"
                  class="btn btn-warning rounded shadowed btn-sm me-1 mb-1 dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <CIcon icon={cilPrint} className="me-2" />Print
                </button>
                <ul class="dropdown-menu">
                  <li><a onClick={printPreview} class="dropdown-item" id="btn_print"><CIcon icon={cilPrint} className="me-2" />Print ពិនិត្យ</a>
                  </li>
                  <li><a onClick={printDiv} class="dropdown-item" id="btn_print_result"><CIcon icon={cilPrint} className="me-2" /> Print លទ្ធផល</a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col>
              <button id="btn_save"
                onClick={exportToExcel}
                class="btn btn-warning btn-sm"
                type="button">
                <CIcon icon={cilSave} className="me-2" />
                Save</button>
            </Col>
            <Col>
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">ថ្ងៃខែឆ្នាំ</span>
                <input class="form-control text-center" type="date"
                  value={valeDate}
                  onChange={inputDate}
                  style={{ color: 'black', lineHeight: '2' }} id="sle_date" />
              </div>
            </Col>
          </Row>
        </Col>

      </>
    )
  }

  //Header of table preview
  const HeaderTable = () => {
    if (primary_g_p1.includes(dbGrade)) {
      return (
        <>
          <thead>
            <tr id="show_hearder" className="frezze">
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ល.រ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ឈ្មោះ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ភេទ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ការស្តាប់</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ការនិយាយ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>អំណាន</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>សរសេរតាមអាន</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>តែងសេចក្តី</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>គ.ផ្ទាល់មាត់</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>គណិតវិទ្យា</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>គ.កិច្ចការផ្ទះ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>វិទ្យាសាស្ត្រ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>សិក្សាសង្គម</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(ខ្មែរ)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(វិទ្យា)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(សិក្សា)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(អង់គ្លេស)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កីឡា</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>អង់គ្លេស</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ពិន្ទុសរុប</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>មធ្យមភាគ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ចំណាត់ថ្នាក់</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>និទ្ទេស</th>
            </tr>
          </thead>
        </>
      )

    }
    if (primary_g_p2.includes(dbGrade)) {
      return (
        <>
          <thead>
            <tr id="show_hearder" className="frezze">
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ល.រ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ឈ្មោះ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ភេទ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>អំណាន</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>សរសេរតាមអាន</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>តែងសេចក្តី</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>វេយ្យាករណ៍</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>គ.ផ្ទាល់មាត់</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>គណិតវិទ្យា</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>គ.កិច្ចការផ្ទះ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>វិទ្យាសាស្ត្រ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ភូមិវិទ្យា</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ប្រវត្តិវិទ្យា</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ពលរដ្ខ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(ខ្មែរ)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(វិទ្យា)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(សិក្សា)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កិ.(អង់គ្លេស)</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>កីឡា</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>អង់គ្លេស</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ពិន្ទុសរុប</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>មធ្យមភាគ</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>ចំណាត់ថ្នាក់</th>
              <th style={{ backgroundColor: 'darkblue', color: 'aliceblue' }}>និទ្ទេស</th>
            </tr>
          </thead>
        </>
      )

    }
  }

  //Main content show
  const ShowAllPart = () => {
    return (
      <>
        <ControlerContent />
        <ShowPassFail />
        <table class="table table-bordered table-hover" id="showData">
          <HeaderTable />
          <tbody id="show_data_result" className="new_account">
            <ShowAllData />
          </tbody>
        </table>
        {dataAverage ?
          (<>
            <div style={{ display: 'none' }}>
              <ViewPrint />

            </div>

          </>)
          : (
            <>
            </>
          )
        }

      </>
    )
  }

  return <ShowAllPart />
}


