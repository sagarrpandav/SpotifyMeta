export const catchErrors = (fn, setError) =>
    function (...args) {
        return fn(...args).catch(err => {
            console.error(err);
            setError(err);
        });
    }();

export const formatDuration = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(((ms % 60000) / 1000));
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const getYear = date => date.split('-')[0];

export const parsePitchClass = note => {
    let key = note;

    switch (note) {
        case 0:
            key = 'C';
            break;
        case 1:
            key = 'D♭';
            break;
        case 2:
            key = 'D';
            break;
        case 3:
            key = 'E♭';
            break;
        case 4:
            key = 'E';
            break;
        case 5:
            key = 'F';
            break;
        case 6:
            key = 'G♭';
            break;
        case 7:
            key = 'G';
            break;
        case 8:
            key = 'A♭';
            break;
        case 9:
            key = 'A';
            break;
        case 10:
            key = 'B♭';
            break;
        case 11:
            key = 'B';
            break;
        default:
            return null;
    }

    return key;
};

export const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};