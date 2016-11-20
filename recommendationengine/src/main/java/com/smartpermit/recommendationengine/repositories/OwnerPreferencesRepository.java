package com.smartpermit.recommendationengine.repositories;

import com.smartpermit.recommendationengine.model.OwnerPreferences;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

/**
 * Created by adwaitkaley on 11/19/16.
 */
@Repository
public class OwnerPreferencesRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<OwnerPreferences> findAllPreferences() {
        String selectAllOwnerPreferenceSql = "SELECT " +
                " `OWNER_ID`, `PERMIT_ID`, `PREFERENCE`" +
                " FROM `OWNER_PREFERENCES`";

        return jdbcTemplate.query(selectAllOwnerPreferenceSql, new OwnerPreferenceRowMapper());
    }

    public OwnerPreferences findOwnerPreferenceById(long ownerId, long permitId) {
        String selectOwnerPreferenceSql = "SELECT " +
                " `OWNER_ID`, `PERMIT_ID`, `PREFERENCE`" +
                " FROM `OWNER_PREFERENCES`" +
                " WHERE OWNER_ID = ? AND PERMIT_ID = ?";

        List<OwnerPreferences> ownerPreferencesList = jdbcTemplate.query(selectOwnerPreferenceSql, new Object[]{ownerId, permitId}, new OwnerPreferenceRowMapper());

        if (ownerPreferencesList.isEmpty()) {
            return null;
        }

        return ownerPreferencesList.get(0);
    }

    public void incrementPreferencecount(long ownerId, long permitId) {
        String updateOwnerPreferenceSql = "UPDATE" +
                " OWNER_PREFERENCES" +
                " SET PREFERENCE = ?" +
                " WHERE OWNER_ID = ? AND PERMIT_ID = ?";
        OwnerPreferences ownerPreferences = findOwnerPreferenceById(ownerId, permitId);
        int incrementedPreference = ownerPreferences.getPreference();
        incrementedPreference++;

        jdbcTemplate.update(updateOwnerPreferenceSql, new Object[]{incrementedPreference, ownerId, permitId});
    }

    public OwnerPreferences create(final OwnerPreferences ownerPreferences) {
        final String insertPermitSql = "INSERT INTO `OWNER_PREFERENCES`" +
                "(`OWNER_ID`, `PERMIT_ID`, `PREFERENCE`)" +
                " VALUES (?,?,?)";

        KeyHolder holder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement preparedStatement = connection.prepareStatement(insertPermitSql, Statement.RETURN_GENERATED_KEYS);
                preparedStatement.setLong(1, ownerPreferences.getOwnerId());
                preparedStatement.setLong(2, ownerPreferences.getPermitId());
                preparedStatement.setInt(3, ownerPreferences.getPreference());
                return preparedStatement;
            }
        }, holder);

        return ownerPreferences;

    }

    public class OwnerPreferenceRowMapper implements RowMapper<OwnerPreferences> {
        @Override
        public OwnerPreferences mapRow(ResultSet resultSet, int i) throws SQLException {
            OwnerPreferences ownerPreferences = new OwnerPreferences();
            ownerPreferences.setOwnerId(resultSet.getLong("OWNER_ID"));
            ownerPreferences.setPermitId(resultSet.getLong("PERMIT_ID"));
            ownerPreferences.setPreference(resultSet.getInt("PREFERENCE"));
            return ownerPreferences;
        }
    }
}
