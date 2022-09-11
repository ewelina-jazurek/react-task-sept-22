import { actions as searchActions } from "./SearchContacts";
import { actions as contactDetailsActions } from "./ContactDetails";

export const updateSearchPhrase = newPhrase =>
  (dispatch, getState, { httpApi }) => {
    dispatch(
      searchActions.updateSearchPhraseStart({ newPhrase }),
    );
    httpApi.getFirst5MatchingContacts({ namePart: newPhrase })
      .then(({ data }) => {
        const matchingContacts = data.map((contact) =>
        ({
          id: contact.id,
          value: contact.name,
        }));
        // TODO something is wrong here
        dispatch(
          searchActions.updateSearchPhraseSuccess({ matchingContacts: [] }),
        );
      })
      .catch(() => {
        // TODO something is missing here
        dispatch(searchActions.updateSearchPhraseFailure());
      });
  };

export const selectMatchingContact = selectedMatchingContact =>
  (dispatch, getState, { httpApi, dataCache }) => {

    // TODO something is missing here
    const getContactDetails = ({ id }) => {
      let value = dataCache.get(id);

      if (value) {
        return new Promise((resolve, reject) =>
          resolve(value));
      } else {
        return httpApi
          .getContact({ contactId: selectedMatchingContact.id })
          .then(({ data }) => {
            const val = {
              id: data.id,
              name: data.name,
              phone: data.phone,
              addressLines: data.addressLines,
            };
            dataCache.set(id, val);
            return val;
          })
      };

    };

    dispatch(
      searchActions.selectMatchingContact({ selectedMatchingContact }),
    );

    dispatch(
      contactDetailsActions.fetchContactDetailsStart(),
    );

    getContactDetails({ id: selectedMatchingContact.id })
      .then((contactDetails) => {
        // TODO something is missing here
        dataCache.store({
          key: contactDetails.id,
        });
        // TODO something is wrong here
        dispatch(
          contactDetailsActions.fetchContactDetailsFailure(),
        );
      })
      .catch(() => {
        dispatch(
          contactDetailsActions.fetchContactDetailsFailure(),
        );
      });
  };
