    SELECT JSON_OBJECT(
        'workspace_id',w.workspace_id,
        'title',w.title,
        'description',w.description,
        'timestamp',w.timestamp_created,
        'private',w.private,
        'creator',JSON_OBJECT(
        'user_id',u.user_id,
        'firstname',u.firstname,
        'lastname',u.lastname
        ),
        'boards',JSON_ARRAYAGG(
            JSON_OBJECT(
                'board_id',b.board_id,
                'title',b.title,
                'description',b.description,
                'timestamp',b.timestamp_created,
                'starred',b.starred,
                'background_type',b.background_type,
                'background_info',b.background_info
            )
        )
    ) as workspace_info
    from workspace_members as wm
    inner join workspace as w on w.workspace_id = wm.workspace_id
    left join board as b on b.workspace_id = w.workspace_id 
    left join users as u on u.user_id = w.creator_user_id
    where wm.user_id = 'user_2YCINbuWlZOfrHfHWtF15y6EiPB'
    group by w.workspace_id
    order by w.timestamp_created desc;




        SELECT JSON_OBJECT(
        'workspace_id',w.workspace_id,
        'title',w.title,
        'description',w.description,
        'timestamp',w.timestamp_created,
        'private',w.private,
        'boards',JSON_ARRAYAGG(
            JSON_OBJECT(
                'board_id',b.board_id,
                'title',b.title,
                'description',b.description,
                'timestamp',b.timestamp_created,
                'starred',b.starred,
                'background_type',b.background_type,
                'background_info',b.background_info
            )
        )
    ) as workspace_info
    from workspace_members as wm
    inner join workspace as w on w.workspace_id = wm.workspace_id
    left join board as b on b.workspace_id = w.workspace_id 
    where wm.user_id = 'user_2YCINbuWlZOfrHfHWtF15y6EiPB'
    group by w.workspace_id
    order by w.timestamp_created desc;
