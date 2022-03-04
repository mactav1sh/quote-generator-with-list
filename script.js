"use strict";

//variables
// text
const savedQuote = document.querySelector(".saved-quote-text");
const savedAuthor = document.querySelector(".saved-quote-author");
const dipslayedQuote = document.querySelector(".displayed-quote");
const displayedAuthor = document.querySelector(".author");
//buttons
const btnNext = document.querySelector(".btn-next");
const btnTweet = document.querySelector(".btn-tweet");
const btnSave = document.querySelector(".btn-save");
// Container
const savedListContainer = document.querySelector(".quotes-list");
const quotesAndbuttons = document.querySelector(".quotes-buttons-container");
const savedContainer = document.querySelector(".saved-container");
// saved quotes array
let savedQuotes = [];

//**************************************************************//

//Spinner

const loadSpinner = async function () {
  document.querySelector(".lds-default").classList.toggle("spinner-active");
  quotesAndbuttons.classList.toggle("container-hide");
  savedContainer.classList.toggle("container-hide");
};
loadSpinner();

// get quotes from api
let apiData = [];
const getJSON = async function () {
  const promise = await fetch("https://type.fit/api/quotes");
  apiData = await promise.json();
  await generateQuote();
  await loadSpinner();

  return apiData;
};
getJSON();

// generate random quote
const generateQuote = async function () {
  const quoteData = apiData;
  const quote = quoteData[Math.ceil(Math.random() * 1643)];
  displayedAuthor.textContent = quote.author ? quote.author : "Uknown";
  dipslayedQuote.textContent = quote.text;
  // console.log(quote);
  btnSave.addEventListener("click", saveQuote);
  btnTweet.addEventListener("click", function () {
    tweet(quote.text, quote.author);
  });
};

// split data
const splitData = function (text, author) {
  const HTML = `<li class="saved-quote">
  <p class="saved-quote-text">${text}</p>
  <div class="saved-author">
    <span class="saved-quote-author">${author}</span>
  </div>
</li>`;
  savedListContainer.insertAdjacentHTML("afterbegin", HTML);
};

// tweet quote
const tweet = function (text, author) {
  const url = `https://twitter.com/intent/tweet?text=${text}-${author}`;
  window.open(url, "_blank");
};

// save quote
const saveQuote = function () {
  //get quote
  const text = dipslayedQuote.textContent;
  const author = displayedAuthor.textContent;
  // split author and quote text
  splitData(text, author);
  //saving to local storage
  const object = { text: text, author: author };
  savedQuotes.push(object);
  // remove event listener to avoid duplicates
  btnSave.removeEventListener("click", saveQuote);
  localStorage.setItem("quotes", JSON.stringify(savedQuotes));
};

// redisplay saved quotes from local storage
const displaySavedQuotes = function () {
  const storageData = JSON.parse(localStorage.getItem("quotes"));
  if (!storageData) return;
  savedQuotes = storageData;
  if (!savedQuotes) return;
  savedQuotes.forEach((object) => splitData(object.text, object.author));
};

// event listeners
btnNext.addEventListener("click", generateQuote);

window.addEventListener("load", displaySavedQuotes);
// localStorage.clear();
