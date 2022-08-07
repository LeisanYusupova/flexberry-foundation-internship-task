const COUNT_OF_DISPLAYED_TICKETS = 5;

const checkboxElements = document.querySelectorAll('.layover-count__input');
const checkboxLabelElements = document.querySelectorAll('.layover-count__control');
const cheapButtonElement = document.querySelector('.search-results-filters__button--cheap');
const fastButtonElement = document.querySelector('.search-results-filters__button--fast');
const ticketElement = document.querySelector('.search-results__item');
const ticketList = document.querySelector('.search-results__list');
const ticketPrice = document.querySelector('.search-results__item-price');
const ticketTotalTime = document.querySelector('.ticket-info__data--total-time');
const ticketElementWay = document.querySelector('.ticket-info__item');
const checkboxBlock = document.querySelector('.layover-count_list');


const getData = (onSuccess)  => {
    fetch('http://localhost:3000/tickets')
      .then((response) => response.json())
      .then((tickets) => {
        onSuccess(tickets);
      });
  };

function getArray(data) {
    let arr = [];
    for (let i =0; i< data.length; i++) {
        arr.push(data[i]);
    }
    return arr;
}

getData((tickets) => {
    console.log(tickets);
    showTickets(tickets);
  });

ticketList.innerHTML='';

function getTimeFromMins(mins) {
    let hours = Math.trunc(mins/60);
	let minutes = mins % 60;
	return hours + 'ч ' + minutes + 'м';
};

function renderTicketList(arrayFromServer) {
    arrayFromServer.forEach((item) => {
        const element= ticketElement.cloneNode(true);
        element.querySelector('.search-results__item-price').textContent = item.price+' P';
        const logoCode = item.carrier;
        element.querySelector('.search-results__item-logo').src = `http://pics.avs.io/99/36/${logoCode}.png`; 
        const totalTime = getTimeFromMins(item.segments[0].duration);
        const totalTimeBack = getTimeFromMins(item.segments[1].duration);
        element.querySelectorAll('.ticket-info__data--total-time')[0].textContent=totalTime;;
        element.querySelectorAll('.ticket-info__origin')[0].textContent=item.segments[0].origin;
        element.querySelectorAll('.ticket-info__destination')[0].textContent=item.segments[0].destination;
        element.querySelectorAll('.ticket-info__data--layovers')[0].textContent=item.segments[0].stops;
        if (item.segments[0].stops.length===0) {
            element.querySelectorAll('.ticket-info__description--layovers-count')[0].textContent='Без пересадок';
        };
        if (item.segments[0].stops.length===1) {
            element.querySelectorAll('.ticket-info__description--layovers-count')[0].textContent='1 пересадка';
        };
        if (item.segments[0].stops.length===3) {
            element.querySelectorAll('.ticket-info__description--layovers-count')[0].textContent='3 пересадки';
        };
        element.querySelectorAll('.ticket-info__data--total-time')[1].textContent=totalTimeBack;;
        element.querySelectorAll('.ticket-info__origin')[1].textContent=item.segments[1].origin;
        element.querySelectorAll('.ticket-info__destination')[1].textContent=item.segments[1].destination;
        element.querySelectorAll('.ticket-info__data--layovers')[1].textContent=item.segments[1].stops;
        if (item.segments[1].stops.length===0) {
            element.querySelectorAll('.ticket-info__description--layovers-count')[1].textContent='Без пересадок';
        };
        if (item.segments[1].stops.length===1) {
            element.querySelectorAll('.ticket-info__description--layovers-count')[1].textContent='1 пересадка';
        };
        if (item.segments[1].stops.length===3) {
            element.querySelectorAll('.ticket-info__description--layovers-count')[1].textContent='3 пересадки';
        };
        ticketList.appendChild(element);   
    }); 
    const allRenderedtickets = document.querySelectorAll('.search-results__item');
    for (let i = COUNT_OF_DISPLAYED_TICKETS; i < arrayFromServer.length; i++) {
        allRenderedtickets[i].classList.add('visually-hidden');
    }
}

function sortTicketsByPrice(data) {
    ticketList.innerHTML='';
    const clonedDataFromServer = data.slice(0);
    const sortedDataFromServer = clonedDataFromServer.sort((a, b) =>
    a.price - b.price);
    return sortedDataFromServer;
}

function sortTicketsByDuration(data) {
    ticketList.innerHTML='';
    const copiedDataFromServer = data.slice(0);
    const sortedFastDataFromServer = copiedDataFromServer.sort((a, b) =>
    a.segments[0].duration+a.segments[1].duration - b.segments[0].duration-b.segments[1].duration
    );
    return sortedFastDataFromServer;
}

function getTicketsByTheLayovers(data, count1, count2, count3) {
    const filteredTickets= data.filter((item => (item.segments[0].stops.length===count1 || item.segments[0].stops.length===count2 || item.segments[0].stops.length===count3 )  && (item.segments[1].stops.length===count1 || item.segments[1].stops.length===count2 || item.segments[1].stops.length===count3 )));
    return filteredTickets;
}




function getTicketsbyPrice(data, count1, count2, count3) {
    const tickets = sortTicketsByPrice(data);
    const allTickets = getTicketsByTheLayovers(tickets, count1, count2, count3);
    console.log(allTickets);    
    const renderedList = renderTicketList(allTickets);
    return renderedList;
}

function getTicketsbyDuration(data, count1, count2, count3) {
    const tickets = sortTicketsByDuration(data);
    const allTickets = getTicketsByTheLayovers(tickets, count1, count2, count3);
    const renderedList = renderTicketList(allTickets);
    return renderedList;
}

function showTickets(items) {
    cheapButtonElement.addEventListener('click', function() {
        fastButtonElement.classList.remove('search-results-filters__button--active');
        cheapButtonElement.classList.add('search-results-filters__button--active');
        showAllTickets();
    })
    
    fastButtonElement.addEventListener('click', function() {
        cheapButtonElement.classList.remove('search-results-filters__button--active');
        fastButtonElement.classList.add('search-results-filters__button--active');
        showAllTickets();

    })

    function showAllTickets() {
        const selectedCheckBoxes = document.querySelectorAll('.layover-count__input:checked');
        console.log(selectedCheckBoxes);
        const checkedValues = Array.from(selectedCheckBoxes).map(cb => cb.id);
        if (checkedValues.length ===0 ) {
            ticketList.innerHTML='';
        }       
        if (checkedValues[0] === 'all' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            let tickets = sortTicketsByPrice(items);
            renderTicketList(tickets);
        }            
        if (checkedValues[0] === 'all'  && fastButtonElement.classList.contains('search-results-filters__button--active')){
            let fastTickets = sortTicketsByDuration(items);
            renderTicketList(fastTickets);
        }
        if (checkedValues[0] === 'without' && cheapButtonElement.classList.contains('search-results-filters__button--active')){
            getTicketsbyPrice(items, 0);
        }           
        if (checkedValues[0] === 'without' && !checkboxElements[4].checked && fastButtonElement.classList.contains('search-results-filters__button--active')){
            getTicketsbyDuration(items, 0);
        }        
        if (checkedValues[0] === 'one' && !checkboxElements[4].checked && !checkboxElements[4].checked && cheapButtonElement.classList.contains('search-results-filters__button--active')){
            getTicketsbyPrice(items, 1);
        }        
        if (checkedValues[0] === 'one' && fastButtonElement.classList.contains('search-results-filters__button--active')){
            getTicketsbyDuration(items, 1);
        }
                
        if (checkedValues[0] === 'two' && !checkboxElements[4].checked && cheapButtonElement.classList.contains('search-results-filters__button--active')){
            getTicketsbyPrice(items, 2);
        }
                
        if (checkedValues[0] === 'two' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 2);
        }
                
        if (checkedValues[0] === 'three' && cheapButtonElement.classList.contains('search-results-filters__button--active')){
            getTicketsbyPrice(items, 3);
        }
               
        if (checkedValues[0] === 'three' && fastButtonElement.classList.contains('search-results-filters__button--active')){
            getTicketsbyDuration(items, 3);
        }                 
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'one' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyPrice(items, 0, 1);
        }
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'one' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 0, 1);
        }
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'two' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyPrice(items, 0, 2);
        }
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'two' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 0, 2);
        }
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'three' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyPrice(items, 0, 3);
        }
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'three' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 0, 3);
        }
        if ( checkedValues[0] === 'one' && checkedValues[1] === 'two' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyPrice(items, 1, 2);
        }
        if ( checkedValues[0] === 'one' && checkedValues[1] === 'two' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 1, 2);
        } 
        if ( checkedValues[0] === 'one' && checkedValues[1] === 'three' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyPrice(items, 1, 3);
        } 
        if ( checkedValues[0] === 'one' && checkedValues[1] === 'three' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 1, 3);
        }   
        if ( checkedValues[0] === 'two' && checkedValues[1] === 'three' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyPrice(items, 2, 3);
        }
        if ( checkedValues[0] === 'two' && checkedValues[1] === 'three' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 2, 3);      
        }  
        if ( checkedValues[0] === 'one' && checkedValues[1] === 'two' && checkedValues[2] === 'three' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyPrice(items, 1, 2, 3);
        } 
        if ( checkedValues[0] === 'one' && checkedValues[1] === 'two' && checkedValues[2] === 'three' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            getTicketsbyDuration(items, 1, 2, 3);
        } 
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'one' && checkedValues[2] === 'two' && checkedValues[3] === 'three' && cheapButtonElement.classList.contains('search-results-filters__button--active')) {
            let ticketsAll = sortTicketsByPrice(items);
            renderTicketList(ticketsAll);
        } 
        if ( checkedValues[0] === 'without' && checkedValues[1] === 'one' && checkedValues[2] === 'two' && checkedValues[3] === 'three' && fastButtonElement.classList.contains('search-results-filters__button--active')) {
            let fastTicketsAll = sortTicketsByDuration(items);
            renderTicketList(fastTicketsAll);
        } 
    }
checkboxBlock.addEventListener('change', showAllTickets);                
}
