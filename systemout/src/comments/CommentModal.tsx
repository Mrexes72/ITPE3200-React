import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import CommentForm from './CommentForm';
import { Comment } from '../types/comment';
import * as CommentService from './CommentService'

interface CommentModalProps {
  show: boolean;
  handleClose: () => void;
  onCommentChanged: (newComment: Comment) => void;
  initialData?: Comment;
  noteId?: number;
  imageId?: number;
  isUpdate?: boolean;
}


const CommentModal: React.FC<CommentModalProps> = ({
  show,
  handleClose,
  onCommentChanged,
  initialData,
  noteId,
  imageId,
  isUpdate = false,
}) => {

  const handleCommentCreated = async (comment:Comment) => {
    try{
      const data = await CommentService.createComment(comment);
      console.log('Comment Created successfully', data);
      onCommentChanged(data);
      handleClose();
      window.location.reload();
    } catch (error){
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  const handleCommentUpdated = async (comment:Comment) => {
    try{
      const data = await CommentService.updateComment(comment.CommentId, comment);
      console.log('Comment update was successful:', data);
      onCommentChanged(data);
      handleClose();
    } catch (error){
      console.error('There was a problem with the fetch operation', error);
    }
  }
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isUpdate ? 'Update Comment' : 'Create Comment'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CommentForm
          onCommentChanged={isUpdate ? handleCommentUpdated : handleCommentCreated}
          CommentId={initialData?.CommentId} // Send CommentId for oppdatering
          NoteId={noteId}
          ImageId={imageId}
          initialData={initialData}
          isUpdate={isUpdate}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentModal;
