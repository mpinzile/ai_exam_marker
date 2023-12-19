document.addEventListener("DOMContentLoaded", function () {
  const questionTypeSelect = document.getElementById("questionType");
  const examSettingSection = document.getElementById("examSettingSection");

  // Add an event listener for the question type select
  questionTypeSelect.addEventListener("change", function () {
    const selectedQuestionType = questionTypeSelect.value;

    // Call a function to update the form based on the selected question type
    updateForm(selectedQuestionType);
  });

  // Function to update the form based on the selected question type
  function updateForm(selectedQuestionType) {
    // Clear the previous content in the examSettingSection
    examSettingSection.innerHTML = "";

    // Add new content based on the selected question type
    switch (selectedQuestionType) {
      case "multiple_choice":
        renderMultipleChoiceForm();
        break;
      case "true_false":
        renderTrueFalseForm();
        break;
      case "open_ended":
        renderOpenEndedForm();
        break;
      default:
        // Handle any other question types
        break;
    }
  }

  // Function to render the form for Multiple Choice questions
  function renderMultipleChoiceForm() {
    // Prompt for the number of choices
    const numChoices = prompt("Enter the number of choices:");

    // Create a card container for the question and choices
    const questionCard = document.createElement("div");
    questionCard.classList.add("question-card");

    // Render the question text area
    const questionInput = document.createElement("textarea");
    questionInput.name = "question";
    questionInput.placeholder = "Enter the question text...";
    questionInput.classList.add(
      "w-full",
      "px-3",
      "py-2",
      "border",
      "rounded-md",
      "mb-4"
    );
    questionCard.appendChild(questionInput);

    // Render the choices input fields
    for (let i = 1; i <= numChoices; i++) {
      const choiceContainer = document.createElement("div");
      choiceContainer.classList.add("choice-container");

      // Choice text area
      const choiceInput = document.createElement("textarea");
      choiceInput.name = `choice${i}`;
      choiceInput.placeholder = `Choice ${i} text...`;
      choiceInput.classList.add("choice-input", "border", "rounded-md");
      choiceContainer.appendChild(choiceInput);

      // Radio icon for correct choice
      const radioIcon = document.createElement("input");
      radioIcon.type = "radio";
      radioIcon.name = "correctChoice";
      radioIcon.value = i;
      radioIcon.classList.add("radio-icon");
      choiceContainer.appendChild(radioIcon);

      // Add the choiceContainer to questionCard
      questionCard.appendChild(choiceContainer);
    }

    // Add input field for marks
    const marksInput = document.createElement("input");
    marksInput.type = "number";
    marksInput.name = "marks";
    marksInput.placeholder = "Enter marks...";
    marksInput.classList.add(
      "w-full",
      "px-3",
      "py-2",
      "border",
      "rounded-md",
      "mb-4"
    );
    questionCard.appendChild(marksInput);

    // Add the questionCard to examSettingSection
    examSettingSection.appendChild(questionCard);
  }

  // Function to render the form for True/False questions
  function renderTrueFalseForm() {
    // Create a card container for the question
    const questionCard = document.createElement("div");
    questionCard.classList.add("question-card");

    // Render the question input field
    const questionInput = document.createElement("textarea");
    questionInput.name = "question";
    questionInput.placeholder = "Enter the question text...";
    questionInput.classList.add(
      "w-full",
      "px-3",
      "py-2",
      "border",
      "rounded-md",
      "mb-4"
    );
    questionCard.appendChild(questionInput);

    // Render the True radio
    const trueRadio = document.createElement("input");
    trueRadio.type = "radio";
    trueRadio.name = "correctChoice";
    trueRadio.value = "true";
    questionCard.appendChild(trueRadio);
    questionCard.appendChild(document.createTextNode("True"));

    // Render the False radio
    const falseRadio = document.createElement("input");
    falseRadio.type = "radio";
    falseRadio.name = "correctChoice";
    falseRadio.value = "false";
    questionCard.appendChild(falseRadio);
    questionCard.appendChild(document.createTextNode("False"));

    // Add input field for marks
    const marksInput = document.createElement("input");
    marksInput.type = "number";
    marksInput.name = "marks";
    marksInput.placeholder = "Enter marks...";
    marksInput.classList.add(
      "w-full",
      "px-3",
      "py-2",
      "border",
      "rounded-md",
      "mb-4"
    );
    questionCard.appendChild(marksInput);

    // Add the questionCard to examSettingSection
    examSettingSection.appendChild(questionCard);
  }

  // Function to render the form for Open Ended questions
  function renderOpenEndedForm() {
    // Create a card container for the question and answer
    const questionCard = document.createElement("div");
    questionCard.classList.add("question-card");

    // Render the question input field
    const questionInput = document.createElement("textarea");
    questionInput.name = "question";
    questionInput.placeholder = "Enter the question text...";
    questionInput.classList.add(
      "w-full",
      "px-3",
      "py-2",
      "border",
      "rounded-md",
      "mb-4"
    );
    questionCard.appendChild(questionInput);

    // Render the answer input field
    const answerInput = document.createElement("textarea");
    answerInput.name = "answer";
    answerInput.placeholder = "Enter the answer text...";
    answerInput.classList.add(
      "w-full",
      "px-3",
      "py-2",
      "border",
      "rounded-md",
      "mb-4"
    );
    questionCard.appendChild(answerInput);

    // Add the questionCard to examSettingSection
    examSettingSection.appendChild(questionCard);
  }
});
