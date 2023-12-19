document.addEventListener("DOMContentLoaded", function () {
  const questionTypeSelect = document.getElementById("questionType");
  const examSettingSection = document.getElementById("examSettingSection");
  const exam = document.getElementById("exam");
  renderOpenEndedForm();
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
    let numChoices;
    do {
      numChoices = prompt("Enter the number of choices:");
    } while (!isValidNumericInput(numChoices));

    // Check if the user clicked "Cancel" on the prompt
    if (numChoices === null) {
      // User canceled, do not update the DOM
      return;
    }

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
      choiceContainer.classList.add(
        "choice-container",
        "flex",
        "items-center",
        "mb-4" // Add margin-bottom to create space between choices
      );

      // Choice text area
      const choiceInput = document.createElement("textarea");
      choiceInput.name = `choice${i}`;
      choiceInput.placeholder = `Choice ${i} text...`;
      choiceInput.classList.add(
        "choice-input",
        "border",
        "rounded-md",
        "w-3/4",
        "p-2" // Add padding for better UX
      );

      choiceContainer.appendChild(choiceInput);

      // Radio icon container
      const radioContainer = document.createElement("div");
      radioContainer.classList.add("radio-container", "w-1/4", "text-center");

      // Radio icon for correct choice
      const radioIcon = document.createElement("input");
      radioIcon.type = "radio";
      radioIcon.name = "correctChoice";
      radioIcon.value = i;
      radioIcon.classList.add("radio-icon");

      radioContainer.appendChild(radioIcon);

      choiceContainer.appendChild(radioContainer);

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

    // Add "Set Question" button
    const setQuestionButton = document.createElement("button");
    setQuestionButton.textContent = "Set Question";
    setQuestionButton.classList.add(
      "bg-indigo-700",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md"
    );
    setQuestionButton.addEventListener("click", function () {
      // Call the API with the question details
      const questionDetails = collectQuestionDetails("multiple_choice");
      console.log("Set Question API called with details:", questionDetails);
      // Example using fetch:
      console.log("Set Question API called with details:", questionDetails);
      fetch("/marking/teacher/set_exam/api/multiple_choice/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          csrfmiddlewaretoken: "{{ csrf_token }}",
        },
        body: JSON.stringify(questionDetails),
      })
        .then(handleApiResponse)
        .catch(handleError);
    });
    questionCard.appendChild(setQuestionButton);

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

    // Create a container for the True/False radio options
    const radioContainer = document.createElement("div");
    radioContainer.classList.add("flex", "mb-4");

    // Render the True radio
    const trueRadioContainer = document.createElement("div");
    trueRadioContainer.classList.add("mr-4"); // Add margin to create space between radio options

    const trueRadio = document.createElement("input");
    trueRadio.type = "radio";
    trueRadio.name = "correctChoice";
    trueRadio.value = "true";
    trueRadio.classList.add("radio-icon");

    trueRadioContainer.appendChild(trueRadio);
    trueRadioContainer.appendChild(document.createTextNode("True"));

    // Render the False radio
    const falseRadioContainer = document.createElement("div");
    const falseRadio = document.createElement("input");
    falseRadio.type = "radio";
    falseRadio.name = "correctChoice";
    falseRadio.value = "false";
    falseRadio.classList.add("radio-icon");

    falseRadioContainer.appendChild(falseRadio);
    falseRadioContainer.appendChild(document.createTextNode("False"));

    radioContainer.appendChild(trueRadioContainer);
    radioContainer.appendChild(falseRadioContainer);

    // Add the radioContainer to questionCard
    questionCard.appendChild(radioContainer);

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

    // Add "Set Question" button
    const setQuestionButton = document.createElement("button");
    setQuestionButton.textContent = "Set Question";
    setQuestionButton.classList.add(
      "bg-indigo-700",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md"
    );
    setQuestionButton.addEventListener("click", function () {
      // Call the API with the question details
      const questionDetails = collectQuestionDetails("true_false");
      console.log("Set Question API called with details:", questionDetails);
      // Example using fetch:
      console.log("Set Question API called with details:", questionDetails);
      fetch("/marking/teacher/set_exam/api/true_false/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          csrfmiddlewaretoken: "{{ csrf_token }}",
        },
        body: JSON.stringify(questionDetails),
      })
        .then(handleApiResponse)
        .catch(handleError);
    });
    questionCard.appendChild(setQuestionButton);

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

    // Add "Set Question" button
    const setQuestionButton = document.createElement("button");
    setQuestionButton.textContent = "Set Question";
    setQuestionButton.classList.add(
      "bg-indigo-700",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md"
    );
    setQuestionButton.addEventListener("click", function () {
      // Call the API with the question details
      const questionDetails = collectQuestionDetails("open_ended");
      console.log("Set Question API called with details:", questionDetails);
      fetch("/marking/teacher/set_exam/api/open_ended/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          csrfmiddlewaretoken: "{{ csrf_token }}",
        },
        body: JSON.stringify(questionDetails),
      })
        .then(handleApiResponse)
        .catch(handleError);
    });
    questionCard.appendChild(setQuestionButton);

    // Add the questionCard to examSettingSection
    examSettingSection.appendChild(questionCard);
  }

  // Function to collect question details before calling the API
  function collectQuestionDetails(questionType) {
    const questionDetails = {
      type: questionType,
      // Add other details based on the question type
    };

    // Collect common details
    const questionInput = examSettingSection.querySelector(
      'textarea[name="question"]'
    );
    const marksInput = examSettingSection.querySelector('input[name="marks"]');
    questionDetails.question = questionInput.value;
    questionDetails.marks = marksInput.value;

    // Collect teacher_id and module_id from hidden inputs
    const teacherIdInput = exam.querySelector('input[name="teacher_id"]');
    const moduleIdInput = exam.querySelector('input[name="module_id"]');
    questionDetails.teacher_id = teacherIdInput.value;
    questionDetails.module_id = moduleIdInput.value;

    // Collect details based on the question type
    switch (questionType) {
      case "multiple_choice":
        // Collect multiple-choice details
        const choices = [];
        const choiceInputs = examSettingSection.querySelectorAll(
          'textarea[name^="choice"]'
        );
        const correctChoiceRadio = examSettingSection.querySelector(
          'input[name="correctChoice"]:checked'
        );
        questionDetails.correctChoice = correctChoiceRadio
          ? correctChoiceRadio.value
          : null;

        choiceInputs.forEach((choiceInput, index) => {
          choices.push({
            text: choiceInput.value,
            isCorrect: (index + 1).toString() === questionDetails.correctChoice,
          });
        });

        questionDetails.choices = choices;
        break;
      case "true_false":
        // Collect true/false details
        const trueFalseRadio = examSettingSection.querySelector(
          'input[name="correctChoice"]:checked'
        );
        questionDetails.correctChoice = trueFalseRadio
          ? trueFalseRadio.value
          : null;
        break;
      case "open_ended":
        // Collect open-ended details
        const answerInput = examSettingSection.querySelector(
          'textarea[name="answer"]'
        );
        questionDetails.answer = answerInput.value;
        break;
      default:
        // Handle any other question types
        break;
    }
    return questionDetails;
  }

  // Function to handle API response
  function handleApiResponse(response) {
    response.json().then((data) => {
      if (response.ok) {
        // Question set successfully
        showSuccessMessage(data.message);
      } else {
        // Show error message from API response
        showErrorMessage(data.error);
      }
    });
  }

  // Function to handle errors
  function handleError(error) {
    console.error("Error:", error);
    // Show a generic error message
    showErrorMessage("An error occurred. Please try again.");
  }

  // Function to show success message
  function showSuccessMessage(message) {
    const successMessage = document.createElement("div");
    successMessage.textContent = message;
    successMessage.classList.add(
      "bg-green-500",
      "text-white",
      "p-3",
      "rounded-md",
      "mb-4",
      "mt-4"
    );
    examSettingSection.appendChild(successMessage);

    // Clear the success message after 3 seconds
    setTimeout(function () {
      successMessage.remove();
      examSettingSection.innerHTML = "";
    }, 3000);
  }

  // Function to show error message
  function showErrorMessage(message) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorMessage.classList.add(
      "bg-red-500",
      "text-white",
      "p-3",
      "rounded-md",
      "mb-4",
      "mt-4"
    );
    examSettingSection.appendChild(errorMessage);
  }

  // Function to validate numeric input
  function isValidNumericInput(value) {
    return value !== null && !isNaN(value) && parseFloat(value) > 0;
  }
});
