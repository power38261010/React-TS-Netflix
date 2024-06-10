import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../../app/slices/subscriptionsSlice';
import { Subscription } from '../../app/interfaces/Subscription';

const SubscriptionComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions, loading, error } = useSelector((state: RootState) => state.subscriptions);

  const [newSubscription, setNewSubscription] = useState<Subscription>({
    id: 0,
    type: "",
  });

  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  const handleCreateSubscription = () => {
    dispatch(createSubscription(newSubscription));
  };

  const handleUpdateSubscription = (subscription: Subscription) => {
    dispatch(updateSubscription(subscription));
  };

  const handleDeleteSubscription = (id: number) => {
    dispatch(deleteSubscription(id));
  };

  return (
    <div>
      <h1>Subscriptions</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div>
        <h2>Add New Subscription</h2>
        <input
          type="text"
          placeholder="Type"
          value={newSubscription.type}
          onChange={(e) => setNewSubscription({ ...newSubscription, type: e.target.value })}
        />
        <button onClick={handleCreateSubscription}>Add Subscription</button>
      </div>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription.id}>
            <p>Type: {subscription.type}</p>
            <button onClick={() => handleUpdateSubscription(subscription)}>Update</button>
            <button onClick={() => handleDeleteSubscription(subscription.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionComponent;
