import React from 'react';

const SearchBox = (props) => {
    return (
        <div className="searching-box-1">
            <input
                className="search-box-top"
                value={props.value}
                onChange={(event) => props.setSearchValue(event.target.value)}
                placeholder="Type to search"></input>
        </div>
    )
};

export default SearchBox;