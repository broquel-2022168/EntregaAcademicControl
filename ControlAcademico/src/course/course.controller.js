'use strict'
import User from '../user/user.model.js'
import { checkUpdate } from '../utils/validator.js'
import Course from './course.model.js'

export const test = (req, res)=>{
    return res.send({message: 'function test is running'})
}

export const saveC = async(req, res)=>{
    try {
       let data = req.body
       let user = await User.findOne({_id: data.teacher})
       if(!user) return res.status(404).send({message: 'user not found'})
       let course = new Course(data)
        await course.save()
        return res.send({message: 'Course saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving course'})
    }
}

export const update = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, false)
        if(!update) return res.status(400).send({message:'Have submited some data that cannot be update or missing data'})
        let updateCourse = await Course.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}    
        ).populate('teacher', ['name', 'email'])
        if(!updateCourse) return res.status(404).send({message: 'Course not found'})
        return res.send({message: 'Animal update successfully',updateCourse})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Internal error'})
    }
}

export const deleteC = async(req, res)=>{
    try {
        let {id} = req.params
        let deletedCourse = await Course.deleteOne({_id: id})
        if(!deletedCourse.deletedCount == 0)return res.status(404).send({message: 'Course not found and not delete'})
        return res.send({message: 'Deleter course successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting course'})
    }
}

export const gett = async(req, res)=>{
    try {
        let courses = await Course.find()
        if(!courses.length === 0) return res.status(404).send({message: 'Not found'})
        return res.send({ courses })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error getting cours'})
    }
}

export const verCursosAsignados = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' })
        }
        const cursosAsignados = user.course
        return res.send({ cursosAsignados })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener los cursos asignados' })
    }
};

