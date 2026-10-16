package com.heliu.ai.writing.service;

import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.writing.api.WritingDtos;
import com.heliu.ai.writing.domain.WritingDraftEntity;
import com.heliu.ai.writing.domain.WritingDraftRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WritingDraftService {
    private final WritingDraftRepository repository;

    public WritingDraftService(WritingDraftRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<WritingDtos.DraftResponse> list() {
        return repository.findAllByWorkspaceIdOrderByUpdatedAtDesc(WorkspaceContext.current()).stream()
                .map(WritingDtos.DraftResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public WritingDtos.DraftResponse get(String id) {
        return WritingDtos.DraftResponse.from(require(id));
    }

    @Transactional
    public WritingDtos.DraftResponse create(WritingDtos.SaveDraftRequest request) {
        WritingDraftEntity entity = new WritingDraftEntity(
                WorkspaceContext.newId("draft"),
                WorkspaceContext.current(),
                request == null ? null : request.title(),
                request == null ? "" : request.content(),
                request == null ? "专业" : request.style()
        );
        return WritingDtos.DraftResponse.from(repository.save(entity));
    }

    @Transactional
    public WritingDtos.DraftResponse update(String id, WritingDtos.SaveDraftRequest request) {
        WritingDraftEntity entity = require(id);
        entity.update(
                request == null ? null : request.title(),
                request == null ? null : request.content(),
                request == null ? null : request.style()
        );
        return WritingDtos.DraftResponse.from(repository.save(entity));
    }

    @Transactional
    public void delete(String id) {
        repository.delete(require(id));
    }

    private WritingDraftEntity require(String id) {
        return repository.findByIdAndWorkspaceId(id, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("写作草稿不存在或无权访问", 404));
    }
}
