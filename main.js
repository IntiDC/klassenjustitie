function getSourceName(link){
    var rootDomain = link.toLowerCase().replace("www.", "").replace(/http(s)?:\/\/?/gi, "").split(".")[0];
    if(rootDomain == "demorgen"){
        rootDomain = "DM";
    }
    if(rootDomain == "nieuwsblad"){
        rootDomain = "NB";
    }
    if(rootDomain == "standaard"){
        rootDomain = "DS";
    }
    return rootDomain;
}
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }

    return val;
}

function getValues(objArray, query){
    var result = [];
    objArray.forEach(function(obj){
        var match = true;
        query.conditions.forEach(function(condition){
            if(obj[condition.key] != condition.value){
                match = false;
            }
        });
        if(match == true){
            result.push(obj[query.key]);
        }
    });
    return result;
}

function getMedian(array){
    array = array.sort();
    return parseInt(array[Math.floor(array.length / 2)]);
}

function getAverage(array){
    var total = 0;
    array.forEach(function(item){
        total += parseFloat(item);
    });
    return Math.round(total / array.length);
}


$(document).ready(function(){
    $.get("./data.csv").then(data => {
        var rows = data.split("\n");
        //first convert to an object
        var headers = rows[0].trim().replaceAll("\"", "").split(",");
        var arrests = [];
        for(var i = 1; i < rows.length; i++){
            var items = rows[i].split(",");
            var obj = {};
            for(var j = 0; j < items.length; j++){
                obj[headers[j]] = items[j];
            }
            arrests.push(obj);
        }
        var html = "";
        window.arrests = arrests;
        document.getElementById("arrest-amount").innerText = arrests.length;
        arrests.forEach(function(item){
            html += `<tr>
                    <td>${item.date}</td>
                    <td>€${item.compensation}</td>
                    <td>${(item.victim_gender == "M")?"Man":"Vrouw"}</td>
                    <td>${item.victim_age}</td>
                    <td>${(item.victim_ethnicity == "NB")?"Niet-Belgisch":"Belgisch"}</td>
                    <td>${item.victim_job}</td>
                    <td><a target="_blank" href="${item.source}">${getSourceName(item.source).toUpperCase()}</a></td>
                </tr>`;
        });
        document.querySelector("#arrests-items").innerHTML = html;
        document.getElementById("stats-tables-container").innerHTML = `
        <div id="stats-averages">
                <table class="dataTable">
                    <thead>
                    <tr>
                        <td></td>
                        <td colspan="3" class="table-group"><span class="table-group-title">Gemiddelden</span><p class="table-group-description">Optelsom gedeeld door aantal.</p></td>
                        <td colspan="3" class="table-group"><span class="table-group-title">Medianen</span><p class="table-group-description">Middelste waarde in gerangschikte volgorde.</p></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><strong>Man</strong></td>
                        <td><strong>Vrouw</strong></td>
                        <td><strong>Alle geslachten</strong></td>
                        <td><strong>Man</strong></td>
                        <td><strong>Vrouw</strong></td>
                        <td><strong>Alle geslachten</strong></td>
                    </tr>
                    <thead>
                    <tbody>
                    <tr>
                        <td><strong>Belgisch</strong></td>
                        <td>€${
                            commaSeparateNumber(getAverage(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "M"
                                    },
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "B"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getAverage(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "V"
                                    },
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "B"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getAverage(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "B"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getMedian(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "M"
                                    },
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "B"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getMedian(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "V"
                                    },
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "B"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getMedian(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "B"
                                    }
                                ]
                            })))
                        }</td>
                    </tr>
                    <tr>
                        <td><strong>Niet-Belgisch</strong></td>
                        <td>€${
                        commaSeparateNumber(getAverage(getValues(arrests, {
                            key : "compensation",
                            conditions : [
                                {
                                    "key" : "victim_gender",
                                    "value" : "M"
                                },
                                {
                                    "key" : "victim_ethnicity",
                                    "value" : "NB"
                                }
                            ]
                        })))
                    }</td><td>€${
                        commaSeparateNumber(getAverage(getValues(arrests, {
                            key : "compensation",
                            conditions : [
                                {
                                    "key" : "victim_gender",
                                    "value" : "V"
                                },
                                {
                                    "key" : "victim_ethnicity",
                                    "value" : "NB"
                                }
                            ]
                        })))
                    }</td>
                    <td>€${
                            commaSeparateNumber(getAverage(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "NB"
                                    }
                                ]
                            })))
                        }
                        </td>
                        <td>€${
                        commaSeparateNumber(getMedian(getValues(arrests, {
                            key : "compensation",
                            conditions : [
                                {
                                    "key" : "victim_gender",
                                    "value" : "M"
                                },
                                {
                                    "key" : "victim_ethnicity",
                                    "value" : "NB"
                                }
                            ]
                        })))
                    }</td><td>€${
                        commaSeparateNumber(getMedian(getValues(arrests, {
                            key : "compensation",
                            conditions : [
                                {
                                    "key" : "victim_gender",
                                    "value" : "V"
                                },
                                {
                                    "key" : "victim_ethnicity",
                                    "value" : "NB"
                                }
                            ]
                        })))
                    }</td>
                    <td>€${
                            commaSeparateNumber(getMedian(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_ethnicity",
                                        "value" : "NB"
                                    }
                                ]
                            })))
                        }
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Alle etniciteiten</strong></td>
                        <td>€${
                            commaSeparateNumber(getAverage(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "M"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getAverage(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "V"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getAverage(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getMedian(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "M"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getMedian(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                        "key" : "victim_gender",
                                        "value" : "V"
                                    }
                                ]
                            })))
                        }</td>
                        <td>€${
                            commaSeparateNumber(getMedian(getValues(arrests, {
                                key : "compensation",
                                conditions : [
                                    {
                                    }
                                ]
                            })))
                        }</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--
        <div id="stats-medians">
            <h3>Medianen</h3>
            <p>De medianen worden berekend door alle schadevergoedingen van laag naar hoog te sorteren, en de middenste waarde te nemen.</p>
    
        </div>-->
        `;
        $.extend( jQuery.fn.dataTableExt.oSort, {
            "date-uk-pre": function (a){
                return parseInt(moment(a, "DD/MM/YYYY").format("X"), 10);
            },
            "date-uk-asc": function (a, b) {
                return a - b;
            },
            "date-uk-desc": function (a, b) {
                return b - a;
            }
        });
    
        $('#arrests-table').DataTable({
            language: {
                url: './lib/nl-NL.json',
            },
            scrollX: true,
            columnDefs: [
                { 
                    targets: 1, 
                    type: 'num-fmt',
                     "render": function (data, type, row) {
                        return commaSeparateNumber(data);
                    },
             }
            ],
            "aoColumns": [
                     { "sType": "date-uk" }, null, null, null, null, null, null
                    ],
                    order: [
                [0, "desc"]
            ]
        });
    });
});