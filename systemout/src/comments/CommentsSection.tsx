import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Dropdown, ButtonGroup, Image } from 'react-bootstrap';
import * as CommentService from '../comments/CommentService';
import * as UserService from '../users/UserService';
import { Comment } from '../types/comment';
import CommentModal from '../comments/CommentModal';
import API_URL from '../apiConfig';

interface CommentsSectionProps {
  NoteId?: number;
  ImageId?: number;
  onCommentDeleted?: (commentId:number) => void;
  onCommentChanged?: (newComment: Comment) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({NoteId, ImageId}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [usernames, setUsernames] = useState<{ [key: number]: string }>({});
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
  const [error, setError ] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const handleOpenCommentModal = (comment: Comment) => {
    setSelectedComment(comment); // Sett valgt kommentar
    setShowCommentModal(true);   // Åpne modalen
  };

  const handleCloseCommentModal = async () => {
    setShowCommentModal(false);
    setSelectedComment(null); // Tilbakestill valgt kommentar
    await fetchComments();
  };

  const handleCommentChanged = async (newComment: Comment) => {
    setComments([...comments, newComment]);
    await fetchComments();
  };

  const handleCommentDeleted = async (commentId:number) => {
    const confirmDelete = window.confirm('Are you aure you want to delete this comment?');
    if(confirmDelete){
      try{
        await CommentService.deleteComment(commentId);
        await fetchComments();
        console.log('Comment deleted', commentId);
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('Failed to delete note.');
      }
    }
  };
  

  const fetchComments = useCallback(async () => {
    try {
      const allComments = await CommentService.fetchComments();
      const filteredComments = allComments.filter(
        (comment: Comment) =>
          (NoteId && comment.NoteId === NoteId) || (ImageId && comment.ImageId === ImageId)
      );
      setComments(filteredComments);
  
      const usernamesMap: { [key: number]: string } = {};
      const userUrlMap: { [key: number]: string} = {};
      await Promise.all(
        filteredComments.map(async (comment) => {
          const user = await UserService.fetchUsersById(comment.UserId);
          usernamesMap[comment.UserId] = user.Name;
          userUrlMap[comment.UserId] = user.ImageUrl;
        })
      );
      setImageUrls(userUrlMap);
      setUsernames(usernamesMap);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to fetch comments.');
    }
  }, [NoteId, ImageId]); // Legg til NoteId og ImageId som avhengigheter



  // Get comments for the Note
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      {comments.map((comment) => (
        <Card key={comment.CommentId} className="mb-3">
          <Card.Body>
            <Row className="d-flex align-items-center">
              <Col xs="auto">
              <Image
              src={`${API_URL}${imageUrls[comment.UserId]}`}
              roundedCircle
              width={50}
              height={50}
              alt={`${usernames[comment.UserId]}'s profile`}
              />
              </Col>
              <Col xs="auto" className="text-muted">
                <strong>{usernames[comment.UserId] || 'Unknown User'}</strong>
              </Col>

              <hr />
            </Row>
            <Row>
              <Col xs="auto">{comment.Body}</Col>
              <Col xs="auto" className='ms-auto'>
                {error && <p className="text-danger">{error}</p>}
                <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle split variant="outline-primary" id="dropdown-split-basic">
                </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleOpenCommentModal(comment)}>
                      Update
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleCommentDeleted(comment.CommentId)}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* Kun én instans av CommentModal, utenfor listen */}
      {selectedComment && (
        <CommentModal
          show={showCommentModal}
          handleClose={handleCloseCommentModal}
          onCommentChanged={handleCommentChanged}
          initialData={selectedComment} // Send valgt kommentar til modal
          isUpdate={true}
        />
      )}
    </div>
  );
};

export default CommentsSection;