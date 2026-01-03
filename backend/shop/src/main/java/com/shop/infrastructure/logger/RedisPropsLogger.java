package com.shop.infrastructure.logger;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RedisPropsLogger {

    public RedisPropsLogger(RedisProperties props) {
        log.warn(">>> Redis host = {}", props.getHost());
        log.warn(">>> Redis port = {}", props.getPort());
        log.warn(">>> Redis password = {}", props.getPassword() != null ? "SET" : "NULL");
        log.warn(">>> Redis SSL    = {}", props.getSsl().isEnabled());
    }
}