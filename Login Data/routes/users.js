// const express = require('express')
// const router = express.Router()
// const User = require('../models/user')

// // Getting All users data 
//     router.get('/', async (req, res) => {
//      try {
//         const users = await User.find()
//         res.send(users)
//      } catch (err){
//         res.status(500).json({message: err.message})
//      }
//     })

// // Getting one
// router.get('/:id', getUser, (req, res) => {
//     res.json(res.user) 

// })

// // Creating One 
// router.post('/', async (req, res) => {
//     const user =  new User({
//         name: req.body.name,
//         department: req.body.department
//     }) 
//     try {
//         const newUser = await user.save()
//         res.status(201).json(newUser)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }

// })

// // Updating one 
// router.patch('/:id', getUser, async(req, res) => {
//     if (req.body.name != null) {
//         res.user.name = req.body.name
//     }
//     if (req.body.department != null) {
//         res.user.department = req.body.department
//     }

//     try {
//         const updatedUser = await res.user.save()
//         res.json(updatedUser)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }

// })

// // Deleting one
// router.delete('/:id', getUser, async (req, res) => {
// try {
// await res.user.deleteOne()
// res.json({message: 'Deleted User'})
// } catch (err){
// res.status(500).json({message: err.message})
// }
// })

// async function getUser(req, res, next){
//     let user
//     try {
//         user = await User.findById(req.params.id)
//         if (user == null) {
//             return res.status(404).json({message: 'Can not find the user'})
//         }
//     } catch (err) {
//         return res.status(500).json({message: err.message})
//     }

//     res.user = user
//     next()
// }


// module.exports = router 



const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, '../user-data.json')

// Helper to read users
function readUsers() {
    const data = fs.readFileSync(dataFile, 'utf8')
    return JSON.parse(data)
}

// Helper to write users
function writeUsers(users) {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2))
}

// Get all users
router.get('/', (req, res) => {
    const users = readUsers()
    res.json(users)
})

// Get one user
router.get('/:id', (req, res) => {
    const users = readUsers()
    const user = users.find(u => u.id === req.params.id)
    if (!user) return res.status(404).json({message: 'User not found'})
    res.json(user)
})

// Create user
router.post('/', (req, res) => {
    const users = readUsers()
    const newUser = {
        id: Date.now().toString(),
        name: req.body.name,
        department: req.body.department,
        startDate: new Date().toISOString()
    }
    users.push(newUser)
    writeUsers(users)
    res.status(201).json(newUser)
})

// Update user  
router.patch('/:id', (req, res) => {
    const users = readUsers()
    const user = users.find(u => u.id === req.params.id)
    if (!user) return res.status(404).json({message: 'User not found'})
    if (req.body.name != null) user.name = req.body.name
    if (req.body.department != null) user.department = req.body.department
    writeUsers(users)
    res.json(user)
})

// Delete user
router.delete('/:id', (req, res) => {
    let users = readUsers()
    const userIndex = users.findIndex(u => u.id === req.params.id)
    if (userIndex === -1) return res.status(404).json({message: 'User not found'})
    users.splice(userIndex, 1)
    writeUsers(users)
    res.json({message: 'Deleted User'})
})

module.exports = router