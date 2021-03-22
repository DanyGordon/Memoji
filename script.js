'use strict';

(function () {
    
    const gameInterface = document.getElementById('game-interface');
    const cardClassList = ['card-container', 'card-back'];
    const cardActiveClass = {
        flipped: 'flipp',
        true: 'true',
        false: 'false',
        success: 'same',
        fail: 'different',
        front: 'card-front',
        inner: 'card-content'
    };
    const cardNumber = 20;
    const gridColumn = 5;
    let flippedCard = [];

    window.gameInit = function () {
        randomOrder(gameInterface);
        gameInterface.addEventListener('click', (event) => {
            let target = event.target;

            if (cardClassList.find(className => target.classList.contains(className) 
                && !target.classList.contains(cardActiveClass.flipped))
            ) {

                reverseToBack(document.querySelectorAll('.' + cardActiveClass.false));
                if (!target.classList.contains(cardClassList[0])) {
                    reverseToFront(target.parentElement);
                }
                else {
                    reverseToFront(target);
                }
            }

            if (Array.from(flippedCard).length % 2 === 0 && flippedCard.length > 0) {
                let result = isTheSame(flippedCard);
                if (result) {
                    isAllCardSame(gameInterface);
                }
            }
        })
    }

    function reverseToFront (element) {
        element.classList.add(cardActiveClass.flipped);
        flippedCard = document.querySelectorAll('.' + cardActiveClass.flipped);
        if (Array.from(flippedCard).length === 1) {
            timerInit();
        }
    }

    function reverseToBack (elements) {
        for (let element of elements) {
            element.classList.remove(cardActiveClass.flipped, cardActiveClass.false);
            element.querySelector('.' + cardActiveClass.front).classList
                .remove(cardActiveClass.fail);
        }
    }

    function isTheSame (cards) {
        let uncheckedCard = Array.from(cards)
            .filter(card => !card.classList.contains(cardActiveClass.false) && 
                !card.classList.contains(cardActiveClass.true));

        if (uncheckedCard.length
            && uncheckedCard[0].querySelector('.' + cardActiveClass.inner).innerHTML.trim() == 
            uncheckedCard[1].querySelector('.' + cardActiveClass.inner).innerHTML.trim()) {

            for (let card of uncheckedCard) {
                card.classList.add(cardActiveClass.true);
                card.querySelector('.' + cardActiveClass.front).classList
                    .add(cardActiveClass.success);
            }
            return true;
        } else {
            for (let card of uncheckedCard) {
                card.classList.add(cardActiveClass.false);
                card.querySelector('.' + cardActiveClass.front).classList
                    .add(cardActiveClass.fail);
            }
            return false;
        }
    }

    function isAllCardSame (container) {
        const allCard = container.querySelectorAll('.' + cardActiveClass.success);
        return Array.from(allCard).length === cardNumber;
    }

    function displayPopUp (id) {
        const popUp = document.getElementById(id);
        popUp.setAttribute('style','display: block;');
        popUp.addEventListener('click', (event) => {
            let target = event.target;
            if (target.classList.contains('off_modal')) {
                event.currentTarget.removeAttribute('style');
                resetCard();
            }
        });
    }

    function resetCard() {
        const cardField = Array.from(gameInterface.children)
            .filter(card => card.classList.contains("flipper"));
        for(let card of cardField) {
            card.querySelector('.card-container').classList.remove('flipp', 'true', 'false');
            card.querySelector('.card-front').classList.remove('different', 'same');
        }
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    function timerInit() {
        const timer = document.getElementById('timer');
        let time = timer.children[0].innerHTML.trim();
        timer.hidden = false;

        const timerRun = setInterval(function() {
            let result = isAllCardSame(gameInterface);
            if(time == 0) {
                return stop(result, timer, timerRun);
            }
            if(time == '01:00') {
                timer.children[0].innerHTML = '00:59';
                time = parseInt(timer.children[0].innerHTML.trim().slice(3));
            }
            else {
                if(typeof time == 'number') {
                    time--;
                    if(result) {
                        return stop(result, timer, timerRun);
                    }
                    if(time < 10) {
                        timer.children[0].innerHTML = '00:0' + time;
                    } else {
                        timer.children[0].innerHTML = '00:' + time;
                    }
                }
            }
        }, 1000);
    }

    function stop(parametr, timer, timerRun) {
        setTimeout(() => {
            console.log('stop')
            clearInterval(timerRun); 
            timer.hidden = true; 
            timer.children[0].innerHTML = '01:00';
        }, 0);
        if(parametr == true) {
            displayPopUp('win');
            return true;
        }
        else if (parametr == false) {
            displayPopUp('loose');
            return false;
        }
    }

    function randomOrder(cardsContainer) {
        let cardsCollection = Array.from(cardsContainer.childNodes)
            .filter(card => card.classList == "flipper");
        cardsCollection = shuffle(cardsCollection);
        const keys = Array.from(mapOfGridRowSetting.keys());
        for(let i = 0; i < cardsCollection.length; i++) {
            cardsCollection[i].setAttribute('style',
            `grid-column-start: ${i+1}; grid-column-end: ${i+2};`);
            const key = keys.find(key => i < key);
            if (key) {
                mapOfGridRowSetting.get(key)(cardsCollection, i);
            }
        }
    }
    
    function shuffle(arr){
        var j, temp;
        for(var i = arr.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    var mapOfGridRowSetting = new Map();
    mapOfGridRowSetting
        .set(gridColumn * 1, (cardsCollection, i) => {
            cardsCollection[i].setAttribute('style',`grid-row-start: ${1}; grid-row-end: ${1};`);
        })
        .set(gridColumn * 2, (cardsCollection, i) => {
            cardsCollection[i].setAttribute('style',`grid-row-start: ${2}; grid-row-end: ${2};`);
        })
        .set(gridColumn * 3, (cardsCollection, i) => {
            cardsCollection[i].setAttribute('style',`grid-row-start: ${3}; grid-row-end: ${3};`);
        })
        .set(gridColumn * 4, (cardsCollection, i) => {
            cardsCollection[i].setAttribute('style',`grid-row-start: ${4}; grid-row-end: ${4};`);
        })
    
}());