function generateTaskReport(tasks, projectStartDate) {
  // Define an object to store task details
  const taskDetails = {};

  // Helper function to format a date as "YYYY-MM-DD"
  function formatDateAsYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  }

  // Helper function to calculate end date based on start date and duration
  function calculateEndDate(startDate, duration) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    return endDate;
  }

  // Helper function to convert a string to camelCase with no spaces
  function toCamelCaseNoSpaces(inputString) {
    return inputString.replace(/\s+/g, '').replace(/^(.)/, (match) => match.toLowerCase());
  }

  // Process each task and calculate details
  tasks.forEach((task) => {
    const [taskName, duration, predecessor, percentCompleted] = task;
    const predecessorDetails = taskDetails[predecessor];

    let startDate;

    if (predecessorDetails) {
      // If there is a predecessor, start one day after its end date
      startDate = calculateEndDate(predecessorDetails.endDate, 1);
    } else {
      // Otherwise, start from project start date
      startDate = new Date(projectStartDate);
    }

    const endDate = calculateEndDate(startDate, duration);

    // Store task details
    taskDetails[taskName] = {
      startDate,
      endDate,
      duration,
      percentCompleted,
      predecessor,
    };
  });

  // Prepare the report in the desired format
  const report = tasks.map((task) => {
    const [taskName] = task;
    const {
      startDate,
      endDate,
      duration,
      percentCompleted,
      predecessor,
    } = taskDetails[taskName];

    // Format dates as "YYYY-MM-DD"
    const formattedStartDate = formatDateAsYYYYMMDD(startDate);
    const formattedEndDate = formatDateAsYYYYMMDD(endDate);

    // Transform task names and dependencies to camelCase with no spaces
    const camelCaseTaskName = toCamelCaseNoSpaces(taskName);
    const camelCaseDependency = toCamelCaseNoSpaces(predecessor);

    // Wrap each field value in double quotes
    const wrappedTaskName = `"${camelCaseTaskName}"`;
    const wrappedStartDate = `"${formattedStartDate}"`;
    const wrappedEndDate = `"${formattedEndDate}"`;
    const wrappedDuration = `"${duration}"`;
    const wrappedPercentCompleted = `"${percentCompleted}"`;
    const wrappedPredecessor = `"${camelCaseDependency}"`;

    return `${wrappedTaskName},${wrappedStartDate},${wrappedEndDate},${wrappedDuration},${wrappedPercentCompleted},${wrappedPredecessor}`;
  });

  // Add the header to the report
  report.unshift('"Task Name","Start Date","End Date","Duration","Percent Completed","Dependencies"');

  // Join the report into a single string with line breaks
  return report.join('\n');
}

// Example usage:
const projectStartDate = new Date('2023-09-01');
const tasks = [
  ['Task A', 5, '', 20],
  ['Task B', 3, 'Task A', 40],
  ['Task C', 2, 'Task A', 30],
];

//const taskReport = generateTaskReport(tasks, projectStartDate);
//console.log(taskReport);

