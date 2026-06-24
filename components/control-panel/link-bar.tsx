'use client';

import { IconInfoCircle } from '@tabler/icons-react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LinkBarProps {
  link?: string;
}

export function LinkBar({ link = '' }: LinkBarProps) {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup className="h-8.5 min-w-0 bg-secondary px-1 [--radius:0px]">
        {/* ensure children can shrink/truncate */}
        <Popover>
          <PopoverTrigger asChild>
            <InputGroupAddon>
              <InputGroupButton variant="ghost" size="icon-xs">
                <IconInfoCircle className="text-muted-foreground" />
              </InputGroupButton>
            </InputGroupAddon>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="flex flex-col gap-1 rounded-none px-5 py-4 text-sm"
          >
            <p className="mb-1 font-medium">Jupyter Notebook</p>
            <p className="text-muted-foreground text-xs">
              Refer to the official documentation for details on the machine
              learning model development process
            </p>
          </PopoverContent>
        </Popover>
        <InputGroupAddon className="pl-1.5 font-normal text-muted-foreground">
          https://
        </InputGroupAddon>
        <span className="min-w-0 flex-1 truncate py-2 text-sm text-muted-foreground">
          {link || 'your-link-here.com'}
        </span>
      </InputGroup>
    </div>
  );
}
