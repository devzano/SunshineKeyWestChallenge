// useFirestore.js
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const useFirestore = () => {
  const fetchAllEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);

      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return eventsList;
    } catch (error) {
      console.error("Error fetching events: ", error);
      return [];
    }
  };

  const fetchAllAuctions = async () => {
    try {
      const auctionsCollection = collection(db, 'auction');
      const auctionsSnapshot = await getDocs(auctionsCollection);

      const auctionsList = auctionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return auctionsList;
    } catch (error) {
      console.error("Error fetching auctions: ", error);
      return [];
    }
  };

  const fetchEventById = async (eventId) => {
    try {
      const eventDocRef = doc(db, 'events', eventId);
      const eventSnapshot = await getDoc(eventDocRef);

      if (eventSnapshot.exists()) {
        return { id: eventSnapshot.id, ...eventSnapshot.data() };
      } else {
        console.error("No such event document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching event by ID: ", error);
      return null;
    }
  };

  const addBidToAuction = async (auctionId, bidderName, bidAmount) => {
    try {
      const bidsCollectionRef = collection(db, 'auction', auctionId, 'bids');
      await addDoc(bidsCollectionRef, {
        name: bidderName,
        bidAmount: parseFloat(bidAmount),
        timestamp: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error adding bid: ", error);
      return false;
    }
  };

  const fetchBidsForAuction = async (auctionId) => {
    try {
      const bidsCollection = collection(db, 'auction', auctionId, 'bids');
      const bidsSnapshot = await getDocs(bidsCollection);
      const bidsList = bidsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      return bidsList;
    } catch (error) {
      console.error("Error fetching bids:", error);
      return [];
    }
  };

  return {
    fetchAllEvents,
    fetchAllAuctions,
    fetchEventById,
    addBidToAuction,
    fetchBidsForAuction,
  };
};

export default useFirestore;