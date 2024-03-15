import moment from "moment";

const generateTimeDurations = () => {
    const currentHour = moment().hour();
    const currentMinute = moment().minute();

    let startHour = currentHour + 1;
    let startMinute = 36;

    // If the start minute exceeds 59, adjust the hour and minute accordingly
    if (startMinute >= 60) {
        startHour += Math.floor(startMinute / 60);
        startMinute = startMinute % 60;
    }

    let endHour = startHour + 1;
    let endMinute = startMinute;

    // If the end hour exceeds 23, wrap around to the next day
    if (endHour >= 24) {
        endHour = endHour % 24;
    }

    // Ensure the hours are in the 12-hour format
    const formattedStartHour = (startHour % 12 === 0) ? 12 : startHour % 12;
    const formattedEndHour = (endHour % 12 === 0) ? 12 : endHour % 12;

    // Determine whether it's AM or PM
    const amOrPmStart = startHour >= 12 ? "PM" : "AM";
    const amOrPmEnd = endHour >= 12 ? "PM" : "AM";

    // Format the start and end times
    const formattedStartTime = moment().hour(formattedStartHour).minute(startMinute).format("hh:mm A");
    const formattedEndTime = moment().hour(formattedEndHour).minute(endMinute).format("hh:mm A");

    return `${formattedStartTime} - ${formattedEndTime}`;
}

const isParkedOrNot = (date, startTime) => {
    const rearrangedDate = date.split('-').reverse().join('-');

    const startDateTimeString = `${rearrangedDate}T${startTime}`;
    const bookingStartDateTime = new Date(startDateTimeString);

    const currentDateTime = new Date();
    return bookingStartDateTime <= currentDateTime;
}

const convertTimestampToTime = (timestamp) => {
    const [hours, minutes] = timestamp?.split(':');
    let formattedHours = parseInt(hours);
    const ampm = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${ampm}`;
};

const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}-${month}-${year}`;
}

const calculateDurationWithEndTimeAndCurrentTime = (endTime, date) => {
    // Parse the provided date string to obtain day, month, and year
    const [day, month, year] = date.split('-').map(Number);

    // Parse the provided end time string to obtain hours and minutes
    const [hours, minutes] = endTime.split(':').map(Number);

    // Create the end time Date object using the provided date and time components
    const endDate = new Date(year, month - 1, day, hours, minutes); // month - 1 because months are 0-indexed in JavaScript

    // Get the current time as a Date object
    const currentDate = new Date();

    // Calculate the difference in milliseconds between the end time and current time
    let durationMs = endDate - currentDate;

    // If the end time is earlier than the current time, consider it as a timeout
    if (durationMs < 0) {
        return 'Timeout';
    }

    // Convert the duration from milliseconds to hours and minutes
    const hoursRemaining = Math.floor(durationMs / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the duration string
    let duration = '';

    if (hoursRemaining > 0) {
        duration += `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}`;
    }

    if (minutesRemaining > 0) {
        if (duration) {
            duration += ' ';
        }
        duration += `${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}`;
    }

    // Return the formatted duration string
    return `${duration} remains`;
}

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return date.toLocaleString('en-US', options);
};

export { generateTimeDurations, convertTimestampToTime, convertTimestampToDate, isParkedOrNot, calculateDurationWithEndTimeAndCurrentTime, formatTimestamp }