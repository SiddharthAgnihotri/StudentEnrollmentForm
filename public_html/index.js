
var connToken = '90934931|-31949248837604878|90959418';
var stuRelationName = 'STUDENT-TABLE';
var stuDBName = 'SCHOOL-DB';
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';

$('#rollNo').focus();

function getStuIdAsJsonObj() {
    var stuId = $('#rollNo').val();
    var jsonStr = {
        "Roll_No": stuId
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;

    $('#fullName').val(record.Full_Name);
    $('#class').val(record.Class);
    $('#birthDate').val(record.Birth_Date);
    $('#address').val(record.Address);
    $('#enrollmentDate').val(record.Enrollment_Date);
}

function getStu() {
    var stuIdJsonObj = getStuIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, stuIdJsonObj);

    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $('#saveBtn').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
        $('#fullName').focus();
        $('#fullName').prop('disabled',false);
        $('#class').prop('disabled',false);
        $('#birthDate').prop('disabled',false);
        $('#address').prop('disabled',false);
        $('#enrollmentDate').prop('disabled',false);
    } else if (resJsonObj.status === 200) {
        $('#rollNo').prop('disabled', true);
        fillData(resJsonObj);
        $('#updateBtn').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
        $('#fullName').focus();
    }
}

function resetForm() {
    $('#rollNo').val('');
    $('#fullName').val('');
    $('#class').val('');
    $('#birthDate').val('');
    $('#address').val('');
    $('#enrollmentDate').val('');

    $('#rollNo').prop('disabled', false);

    $('#saveBtn').prop('disabled', true);
    $('#updateBtn').prop('disabled', true);
    $('#resetBtn').prop('disabled', true);

    $('#rollNo').focus();
}

function saveData() {
    var jsonStrObj = validateData();

    if (jsonStrObj === '') {
        return '';
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({async: false});

    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});

    resetForm();
    $('#rollNo').focus();
}

function validateData() {
    var rollno = $('#rollNo').val();
    var fullname = $('#fullName').val();
    var stuclass = $('#class').val();
    var birthdate = $('#birthDate').val();
    var address = $('#address').val();
    var enrolldate = $('#enrollmentDate').val();

    if (rollno === '') {
        alert("Roll No Missing!");
        $('#rollNo').focus();
        return '';
    }

    if (fullname === '') {
        alert("Full Name Missing!");
        $('#fullName').focus();
        return '';
    }

    if (stuclass === '') {
        alert("Class Missing!");
        $('#class').focus();
        return '';
    }

    if (birthdate === '') {
        alert("Birth Date Missing!");
        $('#birthDate').focus();
        return '';
    }

    if (address === '') {
        alert("Address Missing!");
        $('#address').focus();
        return '';
    }

    if (enrolldate === '') {
        alert("Enrollment Date Missing!");
        $('#enrollmentDate').focus();
        return '';
    }

    var jsonStrObj = {
        "Roll_No": rollno,
        "Full_Name": fullname,
        "Class": stuclass,
        "Birth_Date": birthdate,
        "Address": address,
        "Enrollment_Date": enrolldate
    };

    return JSON.stringify(jsonStrObj);
}

function changeData() {
    $('#updateBtn').prop('disabled', true);

    jsonChg = validateData();

    if (jsonChg === '') {
        $('#updateBtn').prop('disabled', false);
        return '';
    }

    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});

    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});

    resetForm();
    $('#rollNo').focus();
}

$('#rollNo').on('blur', function () {
    if ($(this).val() !== '') {
        getStu();
    }
});

$('#saveBtn').on('click', saveData);
$('#updateBtn').on('click', changeData);
$('#resetBtn').on('click', resetForm);

$('#studentForm').on('submit', function (e) {
    e.preventDefault();
});
