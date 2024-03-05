import * as userModel from './user-model.js'

const UserController = (app) => {
    const findAllUsers = async (req, res) => {
        try {
            const users = await userModel.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).send(error.message);
        }
        
    }
    
    const login = async (req, res) => {
        try {
            const credentials = req.body
            const user = await userModel.getUserByEmailAndPassword(credentials.email, credentials.password)
    
            if (user.length == 0) {
                res.sendStatus(403)
                return
            }
            res.json(user[0])
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    const register = async (req, res) => {
        try {
            const details = req.body
            const user = await userModel.getUserByEmail(details.email)

            if (user.length > 0) {
                res.sendStatus(400)
                return
            }

            const actualUser = await userModel.createUser(details)
            res.json(actualUser)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    app.get('/users', findAllUsers)
    app.post('/users/login', login)
    app.post('/users/register', register)
}

export default UserController