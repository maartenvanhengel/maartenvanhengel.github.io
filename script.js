/*import express, { response } from 'express'
//var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors()) */

let _Value1;
let _Value2;
let _Max;
let _Safety1;
let _Safety2;
let _Temp;
let _SafetyTemp;

let _client_id = "ba0eae30-14d3-407c-825d-488bae3d9f6b";
let _client_secret = "jfm8Q~ALsPnkZwuU.spU6RKqb.n4p4B_7fqH7drv";
let _grant_type ="client_credentials";
let _resource = "https://cgkd3fotrd02e46265de906ef03cdevaos.cloudax.dynamics.com";

function SetScreenValues()
{
    document.getElementById("Amount1Value").innerHTML = "Aantal: " + _Value1;
    document.getElementById("Amount2Value").innerHTML = "Aantal: " + _Value2;
    document.getElementById("AmountTemp").innerHTML = "Temperature: " + _Temp +" graden celcius";

    RemoveTables();
    CalculateTables();
}
function RemoveTables(){
    let table = document.getElementById("table1");
    let x = table.rows.length;
    for(let i =0; i<x-1; i++)
    {
        table.deleteRow(0);
    }
    table = document.getElementById("table2");
    x = table.rows.length;
    for(let i =0; i<x-1; i++)
    {
        table.deleteRow(0);
    }
}
function CalculateTables(){
    _Max = CalculateMax();

    let table = document.getElementById("table1");

    var row;
    var cell1;
    for(let i =0; i<_Value1; i++) //show boxes
    {
        row = table.insertRow(0);
        cell1 = row.insertCell(0);
        cell1.innerHTML = "<td><button onclick='TakeItem1()'class='shelfColor'>p</button></td>";
    }
    for(let i =0; i<(_Max-_Value1); i++) //show empty boxes
    {
        row = table.insertRow(0);
        cell1 = row.insertCell(0);
        cell1.innerHTML = "<td><button class='shelfTransparent'>1</button></td>";
    }
    //table2
    table = document.getElementById("table2");

    for(let i =0; i<_Value2; i++) //show boxes
    {
        row = table.insertRow(0);
        cell1 = row.insertCell(0);
        cell1.innerHTML = "<td><button onclick='TakeItem2()' class='shelfColor'>p</button></td>";
    }
    for(let i =0; i<(_Max-_Value2); i++) //show empty boxes
    {
        row = table.insertRow(0);
        cell1 = row.insertCell(0);
        cell1.innerHTML = "<td><button class='shelfTransparent'>1</button></td>";
    }
}
function CalculateMax(){
    
    if(_Value1 < _Value2){
        return _Value1;
    }
    else{
        return _Value2;
    }
}
function ChangeState(){
    document.getElementById("myDropdown").classList.toggle("show");
}

function SetStartStock()
{
    ChangeState();
    
    //get input values
    _Value1 = document.getElementById("inputAmount1").value;
    _Value2 = document.getElementById("inputAmount2").value;
    _Safety1 = document.getElementById("inputSafetyAmount1").value;
    _Safety2 = document.getElementById("inputSafetyAmount2").value;
    _Temp = document.getElementById("inputTemp").value;
    _SafetyTemp = document.getElementById("inputSafetyTemp").value;

    //check if values are valible
    if(_Value1 <= _Safety1){
        ShowNotification("input for value 1 not allowed");
    }
    else if(_Value2 <= _Safety2){
        ShowNotification("input for value 2 not allowed");
    }
    else if(_Temp <= _SafetyTemp){
        ShowNotification('input temperature not allow');
    }
    else{
        document.getElementById("tempDiv").style.visibility= "visible";
        SetScreenValues();
    }
}
function TakeItem1()
{
    let table = document.getElementById("table1");
    //delete last item
    table.deleteRow(_Max-1);
    //add new ampty item on top
    row = table.insertRow(0);
    cell1 = row.insertCell(0);
    cell1.innerHTML = "<td><button class='shelfTransparent'>1</button></td>";
    
    _Value1--;
    document.getElementById("Amount1Value").innerHTML = "Aantal: " + _Value1;
    if(_Value1 == _Safety1)
    {
       // FireLogicApp(1);
        AddMessageToQueue("k140;120");
        ShowNotification("logic app for shell 1 send");
    }
    if(_Value1 == 0)
    {
        ShowNotification("logic app for shell 1 send with importance");
    }
}

function TakeItem2()
{
    let table = document.getElementById("table2");
    //delete last item
    table.deleteRow(_Max-1);
    //add new ampty item on top
    row = table.insertRow(0);
    cell1 = row.insertCell(0);
    cell1.innerHTML = "<td><button class='shelfTransparent'>1</button></td>";
    
    _Value2--;
    document.getElementById("Amount2Value").innerHTML = "Aantal: " + _Value2;

    if(_Value2 == _Safety2)
    {
        console.log("opgeroepen voor 2");
        //FireLogicApp(2);
        ShowNotification("logic app for shell 2 send");
    }
    if(_Value2 == 0)
    {
        ShowNotification("logic app for shell 2 send with importance");
    }
}
function ShowNotification(text){
    document.getElementById("notificationsBar").innerHTML = text;
    document.getElementById("notificationsBar").style.visibility = "visible";
    setTimeout(() => {
        document.getElementById("notificationsBar").style.visibility = "hidden"
    }, 5000);
    
}
//temperature
function TempUp(){
    _Temp++;
    CheckTemp();
}
function TempDown(){
    _Temp--
    CheckTemp();
}

function CheckTemp(){
    document.getElementById("AmountTemp").innerHTML = "Temperature: " + _Temp +" graden celcius";
    if(_Temp == _SafetyTemp){
        ShowNotification("Temperature safety reach, notification send");
    }
}
let interval;
function TriggerAutoTemp(){ 
    if(document.getElementById("chAuto").checked == true){ //auto temp on
        interval = setInterval(() => {
                let x = Math.floor(Math.random()*4)
                if(x==0)
                {
                    _Temp++
                }
                else{
                    _Temp--;
                }
                CheckTemp();
        }, 2000);
    }
    else{
        clearInterval(interval);
    }
}
/////http
function FireLogicApp(shelf)
{
    let PartitionKey = "8";
    const data = { PartitionKey: PartitionKey, RowKey: shelf};
    let httpstring = 'https://prod-135.westeurope.logic.azure.com:443/workflows/ce71135149d6483aaccaf1b0a26e0702/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=x93H--PRLZQh4YmVJJRvXA1tAFMyHtWlbXL19y1Ytok'
    fetch(httpstring, {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        //.then((response) => /*console.log(response))
        .then((data) => {
        console.log('Success:', data);
        document.getElementById("notificationsBar").innerHTML = "request succided";
        })
        .catch((error) => {
        console.error('Error:', error);
        document.getElementById("notificationsBar").innerHTML = "request failed";
        });
}

function GetAuthoKey()
{
    let httpstring = 'https://login.microsoftonline.com/1ee32a96-f17e-4ed5-91c7-7dc7961267bf/oauth2/token'
    fetch(httpstring)
    .then((response)=> console.log(response))
    .then((data) => console.log(data));
}
function AddMessageToQueue(message)
{
    let httpstring = 'https://tst-ServiceQueue.servicebus.windows.net/queuedata/messages'
    fetch(httpstring, {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL3NlcnZpY2VidXMuYXp1cmUubmV0IiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMWVlMzJhOTYtZjE3ZS00ZWQ1LTkxYzctN2RjNzk2MTI2N2JmLyIsImlhdCI6MTY3ODM0NzMyOCwibmJmIjoxNjc4MzQ3MzI4LCJleHAiOjE2NzgzNTEyMjgsImFpbyI6IkUyWmdZRGh1WDNKRThJM2VoWnlIbDJMa3BralBBQUE9IiwiYXBwaWQiOiI2MmM1NDdjYi03NDhiLTRlZWItYWZhNC0yMDIyMGE1OTc0MDciLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xZWUzMmE5Ni1mMTdlLTRlZDUtOTFjNy03ZGM3OTYxMjY3YmYvIiwib2lkIjoiNDljYzFiMzQtMDNjMC00YTQ0LTlhOWYtYTJiMjY1ZDdhYTU0IiwicmgiOiIwLkFYb0FsaXJqSG43eDFVNlJ4MzNIbGhKbnZfa09vWUJvZ1QxSnFfa3lsOFR2Ymp4NkFBQS4iLCJzdWIiOiI0OWNjMWIzNC0wM2MwLTRhNDQtOWE5Zi1hMmIyNjVkN2FhNTQiLCJ0aWQiOiIxZWUzMmE5Ni1mMTdlLTRlZDUtOTFjNy03ZGM3OTYxMjY3YmYiLCJ1dGkiOiJYMldKQnFiX0xrbWZxcXg2WE9SWUFBIiwidmVyIjoiMS4wIn0.kzSMprp9bzd0TFPSP7wpXykbs5_2eQ5ONr03gFcq9BaJjUlSXIYxDrIKF-i93a8Ezy-kP1t6UlFGGfgc8k0G1jUZ-CZ8auFmdKpOyPzzX2xKPi3UAe8cqOiMzcEsp9Li52iC-JASYvuVgXFX51iu24_W3-n4sHsW4ZF0wZacGHb5iP0wsIAnkm1YtbamjAVSfaiL4lpfS8Q_luZPqmOeHB3xe2BRjeFYcRFwDg2DEdAu2ZLlrwkqbgwoRTmL9JnbclGN1rWG9kQEXk9_ZuvrK6xIwuVQaBpoVC6uKwNGNYfrggGcS_5ZdWWxIo3BMHSIx6OORdFn0-zMpX7lZBrRlw',        
        },
        body: message,
    })
        //.then((response) => /*console.log(response))
        .then((data) => {
        console.log('Success:', data);
        document.getElementById("notificationsBar").innerHTML = "request succided";
        })
        .catch((error) => {
        console.error('Error:', error);
        document.getElementById("notificationsBar").innerHTML = "request failed";
        });
}
function Get365SecuKey()
{
    let PartitionKey = "8";
    shelf = 5;
    const data = { PartitionKey: PartitionKey, RowKey: shelf};
    let httpstring = 'https://login.microsoftonline.com/1ee32a96-f17e-4ed5-91c7-7dc7961267bf/oauth2/token'
    fetch(httpstring, {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        //.then((response) => /*console.log(response))
        .then((data) => {
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}
function CheckIfWarehouseExist(warehouseId)
{
    //check key
    let key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2Nna2QzZm90cmQwMmU0NjI2NWRlOTA2ZWYwM2NkZXZhb3MuY2xvdWRheC5keW5hbWljcy5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMWVlMzJhOTYtZjE3ZS00ZWQ1LTkxYzctN2RjNzk2MTI2N2JmLyIsImlhdCI6MTY3ODM0NzY3OSwibmJmIjoxNjc4MzQ3Njc5LCJleHAiOjE2NzgzNTE1NzksImFpbyI6IkUyWmdZUGl0c0RWZ2FvR25nbGU5Z1dlZzhSOVRBQT09IiwiYXBwaWQiOiJiYTBlYWUzMC0xNGQzLTQwN2MtODI1ZC00ODhiYWUzZDlmNmIiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xZWUzMmE5Ni1mMTdlLTRlZDUtOTFjNy03ZGM3OTYxMjY3YmYvIiwib2lkIjoiNDY1MDhmOTQtYWZiYi00OWNhLTk0OTAtOGM5OGZiZmFkMDUwIiwicmgiOiIwLkFYb0FsaXJqSG43eDFVNlJ4MzNIbGhKbnZ4VUFBQUFBQUFBQXdBQUFBQUFBQUFCNkFBQS4iLCJzdWIiOiI0NjUwOGY5NC1hZmJiLTQ5Y2EtOTQ5MC04Yzk4ZmJmYWQwNTAiLCJ0aWQiOiIxZWUzMmE5Ni1mMTdlLTRlZDUtOTFjNy03ZGM3OTYxMjY3YmYiLCJ1dGkiOiJVNFJ5V3lod1FVV1BTUXg1ck5KakFBIiwidmVyIjoiMS4wIn0.XbJg9i0bL80lBkAWiSVt4i0d9YNZNYLVjwvmiBt6_3RWlfJKgamYOg8SAqGscRtcSPqlE15zBluo4F4o6WmvMlJwNjFkGdPZUnwJ5_q-n6KfCsYjX1YKPZgbwYjgRf1zen4hj4gJJaZ79NsoVOjSLh4FQRYvgJ4WWA3MoSTPASnhHJ7U1-wafQmIrItduFbY7m114lfeBexUF5eH1wn1lHEuACdmgYSAp1gVQsrN4YCOGXskRcdBT0rQ85eBFIlcp0Ye7gmymDwjdKKG0biCwysatzKUP7i-ikkK_zE2jVQjGxPGKd5WfKEqxVKztNkR9l4UPlzqYjtwBvkmRNRSDQ";

    let httpstring = 'https://cgkd3fotrd02e46265de906ef03cdevaos.cloudax.dynamics.com/data/WarehouseLocations'
    fetch(httpstring, {
        method: 'GET', // or 'PUT'
        headers: {
            'Authorization': key
        }
    })
        //.then((response) => /*console.log(response))
        .then((data) => {
            const obj = JSON.parse(data);
            if(data.WarehouseLocationId == warehouseId)
            {
                return true;
            }
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
        return false;
}
function CheckIfProductExist(productId)
{
    //check key
    let key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2Nna2QzZm90cmQwMmU0NjI2NWRlOTA2ZWYwM2NkZXZhb3MuY2xvdWRheC5keW5hbWljcy5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMWVlMzJhOTYtZjE3ZS00ZWQ1LTkxYzctN2RjNzk2MTI2N2JmLyIsImlhdCI6MTY3ODM0NzY3OSwibmJmIjoxNjc4MzQ3Njc5LCJleHAiOjE2NzgzNTE1NzksImFpbyI6IkUyWmdZUGl0c0RWZ2FvR25nbGU5Z1dlZzhSOVRBQT09IiwiYXBwaWQiOiJiYTBlYWUzMC0xNGQzLTQwN2MtODI1ZC00ODhiYWUzZDlmNmIiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xZWUzMmE5Ni1mMTdlLTRlZDUtOTFjNy03ZGM3OTYxMjY3YmYvIiwib2lkIjoiNDY1MDhmOTQtYWZiYi00OWNhLTk0OTAtOGM5OGZiZmFkMDUwIiwicmgiOiIwLkFYb0FsaXJqSG43eDFVNlJ4MzNIbGhKbnZ4VUFBQUFBQUFBQXdBQUFBQUFBQUFCNkFBQS4iLCJzdWIiOiI0NjUwOGY5NC1hZmJiLTQ5Y2EtOTQ5MC04Yzk4ZmJmYWQwNTAiLCJ0aWQiOiIxZWUzMmE5Ni1mMTdlLTRlZDUtOTFjNy03ZGM3OTYxMjY3YmYiLCJ1dGkiOiJVNFJ5V3lod1FVV1BTUXg1ck5KakFBIiwidmVyIjoiMS4wIn0.XbJg9i0bL80lBkAWiSVt4i0d9YNZNYLVjwvmiBt6_3RWlfJKgamYOg8SAqGscRtcSPqlE15zBluo4F4o6WmvMlJwNjFkGdPZUnwJ5_q-n6KfCsYjX1YKPZgbwYjgRf1zen4hj4gJJaZ79NsoVOjSLh4FQRYvgJ4WWA3MoSTPASnhHJ7U1-wafQmIrItduFbY7m114lfeBexUF5eH1wn1lHEuACdmgYSAp1gVQsrN4YCOGXskRcdBT0rQ85eBFIlcp0Ye7gmymDwjdKKG0biCwysatzKUP7i-ikkK_zE2jVQjGxPGKd5WfKEqxVKztNkR9l4UPlzqYjtwBvkmRNRSDQ";

    let httpstring = 'https://cgkd3fotrd02e46265de906ef03cdevaos.cloudax.dynamics.com/data/ReleasedProductsV2'
    fetch(httpstring, {
        method: 'GET', // or 'PUT'
        headers: {
            'Authorization': key
        }
    })
        //.then((response) => /*console.log(response))
        .then((data) => {
            const obj = JSON.parse(data);
            if(data.ItemNumber == productId)
            {
                return true;
            }
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
        return false;
}
