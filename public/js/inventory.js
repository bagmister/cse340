'use strict'

function buildInventoryList(data) {

  const inventoryDisplay = document.getElementById("inventoryDisplay")

  let dataTable = `
    <thead>
      <tr>
        <th>Vehicle</th>
        <th>Modify</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
  `

  data.forEach(function (element) {
    dataTable += `
      <tr>
        <td>${element.inv_make} ${element.inv_model}</td>
        <td><a href="/inv/edit/${element.inv_id}">Modify</a></td>
        <td><a href="/inv/delete/${element.inv_id}">Delete</a></td>
      </tr>
    `
  })

  dataTable += "</tbody>"

  inventoryDisplay.innerHTML = dataTable
}

const classificationList = document.querySelector("#classificationList")

if (classificationList) {

  classificationList.addEventListener("change", function () {

    const classification_id = classificationList.value

    if (!classification_id) {
      document.getElementById("inventoryDisplay").innerHTML = ""
      return
    }

    const classIdURL = "/inv/getInventory/" + classification_id

    fetch(classIdURL)
      .then(response => {
        if (response.ok) return response.json()
        throw Error("Network response was not OK")
      })
      .then(data => {
        console.log(data)
        buildInventoryList(data)
      })
      .catch(error => {
        console.log('There was a problem: ', error.message)
      })
  })
}
