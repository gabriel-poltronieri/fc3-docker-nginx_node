const express = require('express');
const {geradorNome} = require('gerador-nome');
const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');

const initDb = () => {
    const connection = mysql.createConnection(config);
    
    const createTableCommand = "CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id));";
    connection.query(createTableCommand);
    
    connection.end();
}

const addPerson = () => {
    const newName = geradorNome();

    const connection = mysql.createConnection(config);
    
    const insertPersonCommand = `INSERT INTO people(name) values ('${newName}')`;
    connection.query(insertPersonCommand);
    
    connection.end();
}

const completeResponseHtml = (people) => {
    let responseHtml = '<h1>Full Cycle</h1>';
    responseHtml = responseHtml + "<ul>";
    people.forEach(person => {
        responseHtml = responseHtml + `<li>${person.name}</li>`;
    });
    responseHtml = responseHtml + "</ul>";
    return responseHtml;
}

initDb();

app.get('/', (req, res) => {
    addPerson();
    
    const connection = mysql.createConnection(config);
    connection.query("SELECT * FROM people", function (err, result, fields) {
        if (err) throw err;
        let responseHtml = completeResponseHtml(result);
        res.send(responseHtml);
    });
    connection.end();
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})