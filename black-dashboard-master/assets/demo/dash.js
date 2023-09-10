dash = {
    
    initDashboard: function () {

        var tarjetas = document.getElementById("tarjetas");
        var locales = document.getElementById("locales");

        // Init functions for buttons
        $("#1").click(function () {
            tarjetas.style.display = "none";
            locales.style.display = "table";
          });
  
          $("#2").click(function () {
            locales.style.display = "none";
            tarjetas.style.display = "table";
        });

        //data dump from json scrap

        fetch("../assets/json/info.json")  //agarra la data
        .then(response => response.json())
        .then(info => {   //retorno del json file, un array
        let placeholder = document.getElementById("tarjetas-data-output");

        let out = "";

        for(const item of info){
            out += `
                <tr>
                    <td>${item.bank}</td>
                    <td>${item.card}</td>
                    <td>${item.type}</td>
                </tr>
            `;
        }

        placeholder.innerHTML = out ;   //drop the data in the html
        });    




        $("#scrap").click(function () {
            $.ajax({
                url: "../scripts/scrap.py"
            })
            .done(function() {
                alert('Scraping finalizado.')
            })
        });

        
        

        
    }
}