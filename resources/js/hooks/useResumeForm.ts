import { useForm } from '@inertiajs/react';
import { Candidate, Resume } from '@/types/candidate';
import { useEffect } from 'react';
import { Page } from '@inertiajs/core';

export function useResumeForm(onSuccessCallback?: (data: Candidate) => void) {
    // Form for renaming
    const { post: renamePost, processing: isRenaming, errors: renameErrors } = useForm();

    // Form for uploading - simplified structure
    const {
        data: uploadData,
        setData: setUploadData,
        post: uploadPost,
        processing: isUploading,
        errors: uploadErrors,
        reset: resetUpload,
    } = useForm({
        file: null as File | null,
        title: '',
    });

    function uploadResume(resume: Resume) {
        if (resume.file) {
            // Set the data first
            setUploadData('file', resume.file);
            setUploadData('title', resume.title);

            const uploadData = {
                file: resume.file,
                title: resume.title,
            };
        }
    }

    useEffect(() => {
        // Pass data directly to post method
        if(uploadData.file && uploadData.title){
        uploadPost(route('candidate.resume.store'), {
            forceFormData: true,
            onSuccess: (page: Page) => {
                const { candidate } = page.props as unknown as { candidate: Candidate };
                console.log('Upload success:', candidate);
                if (onSuccessCallback && candidate) {
                    onSuccessCallback(candidate);
                }
                resetUpload();
            },
            onError: (errors) => {
                console.log('Upload errors:', errors);
            }
        });
    }
    }, [uploadData])
    function renameResume(id: number, title: string) {
        console.log(id, title);
        renamePost(route('candidate.resume.rename', { id, title }));
    }

    function deleteResume(id: number) {
        renamePost(route('candidate.resume.destroy', { id }));
    }

    return {
        uploadResume,
        isUploading,
        uploadErrors,
        uploadData, // Expose data for debugging
        renameResume,
        deleteResume,
        isRenaming,
        renameErrors,
    };
}
