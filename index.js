export const getUsers = async () => {
    const data = await fetch('users');
    const users = await data.json();


    return users;
}

export const loginUser = async (username, password) => {
    const data = await fetch('login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    const result = await data.json();

    return result;
}