"use strict";

/********************************************************************

Condiments
Sylvain Tran

*********************************************************************/
$(document).on("click", getJSONAttempt);

function getJSONAttempt() {
  $.getJSON("data/data.json")
    .done(dataLoaded)
    .fail(dataNotLoaded);
}

function dataLoaded(data) {
  generateText(data);
}

function generateText(data) {
  console.log(data);
  let randomCondiment = getRandomArrayElement(data.condiments);
  console.log(randomCondiment);
  let verb = "is";
  let vowels = ["a", "e", "i", "o", "u"];
  let article;
  // Does not work with exceptions that would require to check for the phoneme sounding like a vowel's phoneme
  if( randomCondiment.charAt(randomCondiment.length - 1) === "s")
  {
    verb = "are";
  }
  if ( !vowels.includes(randomCondiment.charAt(randomCondiment[0]).toLowerCase() ))
  {
    article = "A";
  }
  else
  {
    article = "An";
  }

  console.log(verb);
  console.log(article);

  let randomCat = getRandomArrayElement(data.cats);
  console.log(randomCat);

  let randomRoom = getRandomArrayElement(data.rooms);
  console.log(randomRoom);

  let randomProgrammingLanguage = getRandomArrayElement(data.programmingLanguages);
  console.log(randomProgrammingLanguage);
	
  let randomLispDialect = getRandomArrayElement(data.lisps);
  console.log(randomLispDialect);
  
  let randomDescription = `${article} ${randomCondiment} ${verb} some ${randomCat} in the ${randomRoom} programming in ${randomProgrammingLanguage}, sadly inferior to ${randomLispDialect}.`;
  $('.generatedText').text(randomDescription);
}

function dataNotLoaded(request, text, error) {
  console.error(error);
  console.log(request);
}

function getRandomArrayElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}