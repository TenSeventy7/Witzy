import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {

  constructor() { }


  questionsChapter1 = [
	{
		"questionText": "This is a question.",
		"solutionText": "This is a solution.",
		"hintText": "This is a hint.",
		"questionScore": 10,
		"answers": [
		  {
			"answer": "This is a right answer.",
			"correct": true,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  }
		]
	  },
	{
		"questionText": "This is a question.",
		"solutionText": "This is a solution.",
		"hintText": "This is a hint.",
		"questionScore": 20,
		"answers": [
		  {
			"answer": "This is a right answer.",
			"correct": true,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  }
		]
	  },
	{
		"questionText": "This is a question.",
		"solutionText": "This is a solution.",
		"hintText": "This is a hint.",
		"questionScore": 30,
		"answers": [
		  {
			"answer": "This is a right answer.",
			"correct": true,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  }
		]
	  },
	{
		"questionText": "This is a question.",
		"solutionText": "This is a solution.",
		"hintText": "This is a hint.",
		"questionScore": 40,
		"answers": [
		  {
			"answer": "This is a right answer.",
			"correct": true,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  }
		]
	  },
	{
		"questionText": "This is a question.",
		"solutionText": "This is a solution.",
		"hintText": "This is a hint.",
		"questionScore": 50,
		"answers": [
		  {
			"answer": "This is a right answer.",
			"correct": true,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  }
		]
	  },
	{
		"questionText": "This is a question.",
		"solutionText": "This is a solution.",
		"hintText": "This is a hint.",
		"questionScore": 60,
		"answers": [
		  {
			"answer": "This is a right answer.",
			"correct": true,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  },
		  {
			"answer": "This is a wrong answer.",
			"correct": false,
			"selected": false
		  }
		]
	  },
  ]
  
  questionsChapter2 = [
		{
      "questionText": "C'est quoi l'hélico",
      "selected": false,
			"answers": [
				{"answer": "Helicopter", "correct": true, "selected": false},
				{"answer": "Plane", "correct": false, "selected": false},
				{"answer": "Truck", "correct": false, "selected": false}
			]
		},
		{
      "questionText": "Quel est le plus gros gars sur",
      "selected": false,
			"answers": [
				{"answer": "Fouad", "correct": false, "selected": false},
				{"answer": "Conan", "correct": false, "selected": false},
				{"answer": "Safare", "correct": true, "selected": false}
			]
		},
		{
      "questionText": "LALALALA LA LA AAAALALALALALALALA LA LALALALA LA LAAAAAAAAA",
      "selected": false,
			"answers": [
				{"answer": "Conan", "correct": true, "selected": false},
				{"answer": "Shrek", "correct": false, "selected": false},
				{"answer": "Truck", "correct": false, "selected": false}
			]
		}

	]
}
