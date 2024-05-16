// Déclaration de la clé API
const apiKey = "mettez_votre_clé_api_ici";

// Recupération des éléments du DOM
const from = document.getElementById("from");
const to = document.getElementById("to");
const amount_from = document.getElementById("amount_from");
const amount_to = document.getElementById("amount_to");
const swap = document.getElementById("swap");
const convert = document.getElementById("convert");

// création des en-tetes pour la requete
const myHeaders = new Headers();
myHeaders.append("apikey", apiKey);

// options de la requete
const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

// événement DOMContentLoaded pour s'assurer que le DOM est chargé
document.addEventListener("DOMContentLoaded", ()=>{
    // fonction asynchrone pour recupérer les symboles de devise
    async function fetchData() {
        // appel de l'API pour recupérer les symboles de devise
        const res = await fetch("https://api.apilayer.com/fixer/symbols", requestOptions)
        // extraction des données JSON de la réponse
        const data = await res.json()

        // boucle à travers les symboles de devise et les ajouter aux options de séléction
        for(const symbol in data.symbols) {
            const option = document.createElement('option');
            option.value = symbol;
            option.innerText = symbol;
            from.appendChild(option);
            to.appendChild(option.cloneNode(true));
        }
    }

    // appel de la fonction fectData pour recupérer les symboles de devise
    fetchData();
});

// événement click sur le button de conversion
convert.addEventListener('click', () => {
    const amountFromValue = amount_from.value.trim();

    // vérification si la valeur est vide ou non numérique
    if(!amountFromValue || isNaN(parseFloat(amountFromValue))) {
        alert(" Veuillez entrer un montant valide dans le champ 'From' ");
        return;
    }

    // fonction asynchrone pour effectuer la conversion de devise
    async function fetchData(amount_from, from, to) {
        // appel de l'API pour effectuer la conversion
        try {

            const res = await fetch(`https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount_from}`, requestOptions)
            // vérification de la réussite de la requete
            if(!res.ok) {
                throw new Error('Erreur lors de la recupération des données !');
            }
            // extraction des données JSON de la réponse
            const data = await res.json()

            // vérification si la conversion de devise a reussi
            if(data.success !== true) {
                throw new Error('Conversion de devise échouée !');
            }
            // affichage du résulat de la conversion dans le champ "TO"
            amount_to.value = data.result.toFixed(2);
        }
        catch(error) {
            console.log('Erreur', error.message);
            alert('Une erreur est survenue lors de la conversion de la devise. Please, try again !')
        }
    }
    // appel de la fonction fetchData pour effectuer la conversion de devise
    if(amount_from.value) {
        fetchData(amount_from.value, from.value, to.value);
    }
});

// événement click sur le button de swap
swap.addEventListener('click', () => {
    const temp = from.value;
    from.value = to.value;
    to.value = temp;

    const temp2 = amount_from.value;
    amount_from.value = amount_to.value;
    amount_to.value = temp2;
});