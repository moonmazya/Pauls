 let currentButIndex = -1
        let buts = [
            ".town",
            ".paul",
            ".rome"
        ]


        const svitokTextElement = document.querySelector(".svitok-content .text")
        const svitokHeaderElement = document.querySelector(".svitok-content .header")

        function setSvitokText(index, element){
            svitokTextElement.innerHTML = svitokContents[index]
            svitokHeaderElement.innerHTML = svitokHeaders[index]
            const hoverImage = element.dataset.hover
            element.src = hoverImage
            if(currentButIndex >= 0){
                console.log(document.querySelector(buts[currentButIndex] + " img").dataset.default)
                document.querySelector(buts[currentButIndex] + " img").src = document.querySelector(buts[currentButIndex] + " img").dataset.default
                
            }
            if(index === currentButIndex) {
                document.querySelector(".svitok").classList.add("hide")
                 Scroller.active = true
                currentButIndex = -1
            }
            else {
                document.querySelector(".svitok").classList.remove("hide")
                 Scroller.active = false
                currentButIndex = index
            }
        }
       

        for(let i = 0; i < buts.length; i++){
            document.querySelector(buts[i] + " img").addEventListener("click", function(e){setSvitokText(i,e.target)})
            document.querySelector(buts[i] + " img").dataset.default = document.querySelector(buts[i] + " img").src
        }
        
        document.querySelector(".svitok .close-but").addEventListener("click", () => {
            document.querySelector(".svitok").classList.add("hide")
             Scroller.active = true
            for(let i = 0; i < buts.length; i++){
                document.querySelector(buts[i] + " img").src = document.querySelector(buts[i] + " img").dataset.default
            }
            currentButIndex = -1
        })
    