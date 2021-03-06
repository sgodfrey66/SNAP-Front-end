import React, { useState } from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import { NavLink, useHistory } from 'react-router-dom';
import PaginatedDataTable from 'components/PaginatedDataTable';
import { ErrorMessage } from 'components/common';
import { EditActionLink } from 'components/tableComponents';

import { formatDateTime } from 'utils/typeUtils';
import { formatOwner } from 'utils/modelUtils';

import useResourceIndex from 'hooks/useResourceIndex';
import usePaginatedDataTable from 'hooks/usePaginatedDataTable';

function SurveySelect({ client }) {
  const history = useHistory();
  const surveyIndex = useResourceIndex('/surveys/', []);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const options = surveyIndex.data.map(({ id, name }) => ({
    value: id,
    text: name,
  }));

  return (
    <Form>
      <Form.Group>
        <Form.Select
          options={options}
          placeholder="Select survey"
          value={selectedSurvey}
          onChange={(e, { value }) => setSelectedSurvey(value)}
          disabled={!surveyIndex.ready}
        />
        <Button
          disabled={!selectedSurvey}
          onClick={() => {
            history.push(
              `/responses/new?surveyId=${selectedSurvey}&clientId=${client.id}`
            );
          }}
        >
          Survey Client
        </Button>
      </Form.Group>
      <ErrorMessage error={surveyIndex.error} />
    </Form>
  );
}

export default function ResponsesTab({ client }) {
  const table = usePaginatedDataTable({
    url: `/responses/?client=${client.id}`,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: 'Survey',
        accessor: 'id',
        Cell: ({ value, row }) => {
          return (
            <NavLink to={`/responses/${value}`}>
              {row.original.survey.name}
            </NavLink>
          );
        },
      },
      {
        Header: 'Answers',
        accessor: 'answers',
        Cell: ({ value, row }) => {
          return value.length;
        },
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Date Modified',
        accessor: 'modified_at',
        Cell: ({ value }) => formatDateTime(value, true),
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        Cell: ({ value }) => formatOwner(value),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row, actions }) => (
          <>
            <EditActionLink to={`/responses/${row.original.id}/edit`} />
            {/* <Button
              onClick={(...args) => {
                actions.updateRow(row, { created_at: new Date() });
              }}
            /> */}
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Header as="h4">Survey Client</Header>
      <SurveySelect client={client} />
      <Header as="h4">Client Responses</Header>
      <PaginatedDataTable columns={columns} table={table} />
    </>
  );
}
