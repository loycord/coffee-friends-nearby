import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
// types
import { Message, Room } from '../../redux/types';

interface Props {
  navigation: {
    state: {
      params: {
        data: Room;
      };
    };
  };
}

interface State {
  messages: Message[];
  user: {
    _id: string;
    name: string;
    avatar: string;
  } | null;
  initialMessages: boolean;
}

class Container extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.findMyInfo = this.findMyInfo.bind(this);
    this.state = {
      messages: [],
      user: this.findMyInfo(),
      initialMessages: false
    };

    this.updateRoom = this.updateRoom.bind(this);
    this.addMessages = this.addMessages.bind(this);
    this.createMessageRef = this.createMessageRef.bind(this);
  }

  componentWillMount() {
    const ref = this.createMessageRef();
    const query = ref.orderBy('createdAt', 'desc');
    query.onSnapshot(querySnapshots => {
      const { initialMessages } = this.state;
      let messages: Message[] | any = [];
      if (!initialMessages) {
        this.setState({ initialMessages: true });
        querySnapshots.forEach(doc => {
          const docData = doc.data();
          docData.createdAt = new Date(docData.createdAt.seconds * 1000);
          messages.push(docData);
        });
      } else {
        if (querySnapshots.docs.length > 0) {
          const message = querySnapshots.docs[0].data();
          message.createdAt = new Date(message.createdAt.seconds * 1000);
          messages.push(message);
        }
      }

      console.log('[FIRESTORE] -- GET COLLECTION "messages" --- ', messages);
      const readCount = firebase.database().ref('read');
      readCount.transaction(currentValue => (currentValue || 0) + 1);

      this.addMessages(messages);
    });
  }

  componentWillUnmount() {
    const ref = this.createMessageRef();
    const un = ref.onSnapshot(() => {});
    un();
  }

  createMessageRef() {
    const { data } = this.props.navigation.state.params;

    const messageCollectionRef = firebase
      .firestore()
      .collection('rooms')
      .doc(data.docId)
      .collection('messages');

    return messageCollectionRef;
  }

  addMessages(messages: any[] = []) {
    this.setState(prevState => ({
      messages: GiftedChat.append(prevState.messages, messages)
    }));
  }

  onSend(messages: Message[] = []) {
    console.log(messages);
    const ref = this.createMessageRef();
    if (messages) {
      const messageDocRef = ref.doc(messages[0]._id);
      messageDocRef.set(messages[0]);
      this.updateRoom(messages[0]._id, messages[0].text);
      
      console.log('[FIRESTORE] -- SET COLLECTION "messages" --- ', messages[0]);
      const writeCount = firebase.database().ref('write');
      writeCount.transaction(currentValue => (currentValue || 0) + 1);
    }
  }

  updateRoom(uid: string, content: string) {
    const { data } = this.props.navigation.state.params;

    const roomDocRef = firebase
      .firestore()
      .collection('rooms')
      .doc(data.docId);

    roomDocRef
      .update({
        lastMessage: {
          uid,
          content
        },
        updatedAt: new Date()
      })
      .then(() => {
        console.log('[FIRESTORE] -- UPDATE DOCUMENT "room" --- ', content);
        const writeCount = firebase.database().ref('write');
        writeCount.transaction(currentValue => (currentValue || 0) + 1);
      })
      .catch(error => console.log(error));
  }

  findMyInfo() {
    const { data } = this.props.navigation.state.params;
    const { currentUser } = firebase.auth();
    if (currentUser) {
      let myInfo;
      let myId;
      if (currentUser.uid === data.fId) {
        myInfo = data.from;
        myId = data.fId;
      } else {
        myInfo = data.to;
        myId = data.tId;
      }
      return {
        _id: myId,
        name: myInfo.displayName,
        avatar: myInfo.photoURL
      };
    }
    return null;
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages: any) => this.onSend(messages)}
        user={this.state.user}
      />
    );
  }
}

export default Container;
