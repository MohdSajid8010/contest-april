
let IP_add;
$.getJSON("https://api.ipify.org?format=json", function (data) {
    IP_add = data.ip;
    console.log(data.ip)
    $("#ip").html(data.ip);
    // get_data();

})

/*city: "Delhi"
country: "IN"
ip: "103.163.167.55"
loc: "28.6519,77.2315"
org: "AS135232 Ipnet Broadband Network Pvt Ltd"
postal: "110001"
region: "Delhi"
timezone: "Asia/Kolkata"
*/
function get_data() {
    fetch(`https://ipinfo.io/${IP_add}?token=8731becb0a31da`)
        .then((res) => res.json())
        .then((data) => {
            let lattitude = data.loc.split(",")[0];
            let longnitude = data.loc.split(",")[1];

            document.querySelector(".above-map").innerHTML = ` <div><strong>Lat:</strong>${lattitude}</div>
            <div><strong>City:</strong>${data.city}</div>
            <div><strong>Organisation:</strong>${data.org}</div>
            <div><strong>Long:</strong>${longnitude}</div>
            <div><strong>Region:</strong>${data.region}</div>
            <div> <strong>Hostname:</strong>...</div>`

            document.getElementById("gog-map").innerHTML = `<iframe src="https://maps.google.com/maps?q=${lattitude},${longnitude}&z=15&output=embed"></iframe>`

            let _datetime_str = new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });// "3/22/2021, 5:05:51 PM"

            document.querySelector(".below-map").innerHTML = ` <div><strong>Time Zone:</strong>${data.timezone}</div>
                <div><strong>Date And Time:</strong>${_datetime_str}</div>
                <div><strong>Pincode:</strong>${data.postal}</div>
                <div id="message"> </div>`


            console.log(data);
            return data.postal;
        }).then((pin_code) => {
            get_postoffice(pin_code)


        }).catch((err) => {
            console.log(err.message);
        })
}


function get_postoffice(pincode) {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res => res.json()))
        .then((data) => {
            console.log("inside get post office")

            console.log(data);//arr
            let no_of_postoffice = data[0].Message;
            document.getElementById("message").innerHTML = `<strong>Message:</strong>${no_of_postoffice}`;

            show_post_office(data[0].PostOffice);//arr
        }).catch((err) => {
            console.log(err.message);
        })
}
function show_post_office(arr) {
    let grid_container = document.querySelector(".grid-cont");
    grid_container.innerHTML = "";
    arr.forEach(obj => {
        grid_container.innerHTML += `<div class="drig-child">
        <div><strong>Name:</strong><span>${obj.Name}</span></div>
        <div> <strong>Branch Type:</strong><span>${obj.BranchType}</span></div>
        <div> <strong>Delivery Status:</strong><span>${obj.DeliveryStatus}</span></div>
        <div><strong>District:</strong><span>${obj.District}</span></div>
        <div><strong>Division:</strong><span>${obj.Division}</span></div>
    </div>`;

    });
    document.querySelector(".seach-inp-containeer").style.display="block"
}

document.getElementById("btn").addEventListener("click", () => {
    document.getElementById("btn").style.display = "none";
    get_data();
});


//search----
let grid_childAll = document.getElementsByClassName("drig-child");
document.getElementById("searchId").addEventListener("keyup", (e) => {
    let searchStr = e.target.value.toLowerCase().trim();

    for (let i = 0; i < grid_childAll.length; i++) {

        let name = grid_childAll[i].firstElementChild;//div
        let branch_type = grid_childAll[i].children[1];//div
        // console.log(name, branch_type)

       let  name1 = name.getElementsByTagName("span")[0].textContent.toLowerCase().trim();
        let branch_type1 = branch_type.getElementsByTagName("span")[0].textContent.toLowerCase().trim();

        // console.log(name1, branch_type1)
        if (name1.includes(searchStr) || branch_type1.includes(searchStr)) {
            grid_childAll[i].style.display = "";
        }
        else {
            grid_childAll[i].style.display = "none";
        }
    }

})
