package com.beconnected.service;

import com.beconnected.model.FeedItem;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class FeedService {

    public List<FeedItem> getUserFeed(Long userId) {
        return Collections.emptyList();
    }
}
