package com.hdw.system.service.impl;


import com.hdw.common.mybatis.base.service.impl.BaseServiceImpl;
import com.hdw.system.entity.SysFile;
import com.hdw.system.mapper.SysFileMapper;
import com.hdw.system.service.ISysFileService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.dubbo.config.annotation.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 附件表
 *
 * @author TuMinglong
 * @date 2018-12-11 11:35:15
 */
@Slf4j
@Service(interfaceName = "ISysFileService")
@Transactional(rollbackFor = Exception.class)
public class SysFileServiceImpl extends BaseServiceImpl<SysFileMapper, SysFile> implements ISysFileService {

    @Override
    public List<SysFile> selectFileListByTableIdAndRecordId(Map<String, Object> params) {
        return this.baseMapper.selectFileListByTableIdAndRecordId(params);
    }

    @Override
    public void deleteFile(String tableId, String recordId, String attachmentGroup, String attachmentName, String attachmentPath) {
        Map<String, Object> map = new HashMap<>();
        if (StringUtils.isNotBlank(tableId)) {
            map.put("table_id", tableId);
        }
        if (StringUtils.isNotBlank(recordId)) {
            map.put("record_id", recordId);
        }
        if (StringUtils.isNotBlank(attachmentGroup)) {
            map.put("attachment_group", attachmentGroup);
        }
        if (StringUtils.isNotBlank(attachmentName)) {
            map.put("attachment_name", attachmentName);
        }
        if (StringUtils.isNotBlank(attachmentPath)) {
            map.put("attachment_path", attachmentPath);
        }
        this.baseMapper.deleteByMap(map);
    }
}
