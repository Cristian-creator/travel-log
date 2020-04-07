import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createLogEntry } from './API';

const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            const created = await createLogEntry(data);
            onClose();
        } catch (error) {
            console.error(error);
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <form className="entry-form" onSubmit={handleSubmit(onSubmit)} >
            { error ? (<h3 className="error"> {error} </h3>) : null }
            <label htmlFor="text">Title</label>
            <input type="text" required name="title" ref={register} />
            <label htmlFor="comments" >Comments</label>
            <textarea name="comments" required rows={3}  ref={register}  ></textarea>
            <label htmlFor="description" >Description</label>
            <textarea name="description" rows={3}  ref={register} ></textarea>
            <label htmlFor="image">Image</label>
            <input name="image"  ref={register}  />
            <label htmlFor="visitDate"  >Visit Date</label>
            <input type="date" name="visitDate" required ref={register} />
            <button disabled={loading}> {loading ? 'Loading...' : 'Create Log'} </button>
        </form>
    )
}

export default LogEntryForm;
