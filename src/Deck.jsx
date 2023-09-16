import { useEffect, useRef, useState } from "react";
import axios from "axios"
import Card from "./Card";

function Deck() {
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);
    const drawButton = useRef(null);
    const timer = useRef(null);

    function resetTimer() {
        clearInterval(timer.current)
        timer.current = null;
    }

    useEffect(() => {
        console.log(deck)
        async function getDeck() {
            const ref = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            setDeck(ref.data)
        }
        getDeck()

    }, [])


    function toggleDraw() {

        drawButton.current.innerText = (drawButton.current.innerText == "Draw" ? "Stop drawing" : "Draw");

        if ((drawButton.current.innerText == "Stop drawing") && !timer.current) {
            timer.current = setInterval(async function timerDraw() {
                await getCard()
            }, 500)
        } else {
            resetTimer()
        }

    }

    async function getCard() {

        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`)

        if (res.data.success) {
            setCards(c => [...c, res.data.cards[0]])
        }

        if (res.data.remaining == 0) {
            resetTimer()
            drawButton.current.disabled = true;
            drawButton.current.innerText = "No cards remaining"
            alert("No cards remaining.")
        }



    }




    return (
        <>

            <div hidden ></div>

            <button ref={drawButton} onClick={toggleDraw}>Draw</button>
            <div>
                {cards.map((card) => <Card key={card.code} img={card.image} />)}
            </div>

        </>
    )


}


export default Deck;