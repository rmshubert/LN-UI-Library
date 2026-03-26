import PropTypes from 'prop-types';

export const List = ({ ordered, items, listStyleType, start }) => {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag
      className="pl-6 space-y-1 text-base text-gray-800"
      style={listStyleType ? { listStyleType } : undefined}
      start={ordered ? start : undefined}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
};

List.propTypes = {
  ordered: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.string),
  listStyleType: PropTypes.string,
  start: PropTypes.number,
};

List.defaultProps = {
  ordered: false,
  items: ['Item one', 'Item two', 'Item three'],
  start: 1,
};
