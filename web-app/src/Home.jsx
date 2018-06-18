import React from 'react';
import FlatButton from 'material-ui/FlatButton';

export default ({
  chatrooms,
  onEnterChatroom
}) => (
  <div>
    {
      chatrooms.map(chatroom => (
        <FlatButton
          key={chatroom.name}
          label="Start a conversation"
          primary
          onClick={() => onEnterChatroom(chatroom.name)}
        />
      ))
    }
  </div>
)
