$(document).ready(function() {
    $('#popup').popup({
        blur: false
    });
    /* pop-up must be only closed with X button, not by clicking outside */
    
    $('#popup form .command :submit').on("click",function (e){
        e.preventDefault();
        
        const data = new FormData($('#form')[0]);
        
        for (var pair of data.entries()){
            console.log(pair[0] + ':' + pair[1]);
        }
        
        $.ajax({
            url: '/addItem',
            data: JSON.stringify({
                name: $("#name").val(),
                type: $("#type").val(),
                brand: $("#brand").val(),
                classification: $("#classification").val(),
                design: $("#design").val(),
                size: $("#size").val(),
                weight: $("#weight").val(),
                quantity: $("#quantity").val(),
                sellingType: $("#sellingType").val(),
                purchasePrice: $("#purchasePrice").val(),
                sellingPrice: $("#sellingPrice").val(),
                status: $("#status").val(),
            }),
            type: 'POST',
            processData: false,
            contentType: false,
            headers: {
                "Content-Type": "application/json"
            },
            
            success: function(flag){
                if(flag){
                    console.log("success");
                }
            }
        });
        // window.fetch("/auth/login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: data
        // })
    })
});

// $(document).ready(function() {
//     $('#popup').popup({});
// });

// window.addEventListener("load", function(e){
//     const form = this.document.querySelector("#form");
//     const button = this.document.querySelector("#create");
//     const data = new FormData($('#form')[0]);

//     button.addEventListener("click", (e)=> {
//         e.preventDefault();

//         for (var pair of data.entries()){
//             console.log(pair[0] + ':' + pair[1]);
//         }

//         this.fetch("/addItem", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             //body: data
//             body: JSON.stringify({
//                 name: this.document.querySelector("#productName").value,
//                 type: data.get("type"),
//                 brand: data.get("brand"),
//                 classification: data.get("classification"),
//                 design: data.get("design"),
//                 size: data.get("size"),
//                 weight: data.get("weight"),
//                 quantity: data.get("quantity"),
//                 sellingType: data.get("sellingType"),
//                 purchasePrice: data.get("purchasePrice"),
//                 sellingPrice: data.get("sellingPrice"),
//                 status: data.get("status"),
//             })
//         }).catch(err => console.log(err))
//     });
// });
